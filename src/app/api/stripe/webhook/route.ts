import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { updateOrderStatus, logStripeEvent, getOrder, updateOrderDigitalDeliveryStatus, isEventProcessed } from '@/data/store/storeDbManager';
import { decrementStock } from '@/data/store/inventoryDbManager';
import { sendDigitalDeliveryEmail } from '@/services/emailService';
import { getProductDetails } from '@/utils/catalog';
import { PhotoIdType } from '@/utils/cdn/cdnAssets';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }
    // @ts-ignore - Stripe expect Buffer or string, next.js req.text() is string
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Idempotency check: Check if this event has already been processed
  try {
    const alreadyProcessed = await isEventProcessed(event.id);
    if (alreadyProcessed) {
      console.log(`Event ${event.id} already processed. Skipping.`);
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (dbError) {
    console.error('Error checking idempotency:', dbError);
    // If DB is down, return 500 so Stripe retries
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  // Log all events to the database for audit trail
  // We'll try to find an orderId in metadata or client_reference_id
  let orderIdStr = (event.data.object as any).client_reference_id || (event.data.object as any).metadata?.orderId;
  const orderId = orderIdStr ? parseInt(orderIdStr) : null;

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        if (orderId) {
          const session = event.data.object as Stripe.Checkout.Session;
          const customerEmail = session.customer_details?.email || undefined;
          const shipping = (session as any).shipping_details;
          
          let shippingAddress = "";
          if (shipping?.address) {
            const addr = shipping.address;
            shippingAddress = [
              shipping.name,
              addr.line1,
              addr.line2,
              addr.city,
              addr.state,
              addr.postal_code,
              addr.country
            ].filter(Boolean).join(", ");
          }

          await updateOrderStatus(orderId, 'paid', 'unfulfilled', customerEmail, shippingAddress);
          
          // Fetch order items to handle inventory and digital delivery
          const order = await getOrder(orderId);
          if (order && order.items) {
            const digitalItems = [];
            
            for (const item of order.items) {
              const details = getProductDetails(item.product_id as PhotoIdType, item.variant_id);
              
              if (details?.isDigital) {
                digitalItems.push({
                  title: item.title,
                  downloadLink: `https://photography.kevinshou.com/api/download/${item.product_id}` // Mock link
                });
              } else {
                // Only decrement stock for physical items
                await decrementStock(item.product_id, item.variant_id, item.quantity);
              }
            }

            // Handle digital delivery if applicable
            if (digitalItems.length > 0 && customerEmail) {
              try {
                await sendDigitalDeliveryEmail(customerEmail, orderId, digitalItems);
                await updateOrderDigitalDeliveryStatus(orderId, 'sent');
                console.log(`Digital delivery email sent for order ${orderId}`);
              } catch (emailError) {
                console.error(`Failed to send digital delivery email for order ${orderId}:`, emailError);
                await updateOrderDigitalDeliveryStatus(orderId, 'failed');
              }
            } else {
              await updateOrderDigitalDeliveryStatus(orderId, digitalItems.length > 0 ? 'failed_no_email' : 'not_applicable');
            }
          }

          await logStripeEvent(orderId, event.type, event, event.id);
          console.log(`Order ${orderId} marked as paid and inventory decremented.`);
        } else {
          console.error('No orderId found in session client_reference_id or metadata');
          await logStripeEvent(null, event.type, event, event.id);
        }
        break;

      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'charge.succeeded':
        // Log these events to the relevant order if possible
        await logStripeEvent(orderId, event.type, event, event.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
        await logStripeEvent(orderId, event.type, event, event.id);
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    // Return 500 so Stripe will retry
    return new NextResponse('Error processing webhook', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
