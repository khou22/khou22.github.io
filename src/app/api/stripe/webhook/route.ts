import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOrderEmail } from '@/lib/mailgun';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore - version might vary slightly depending on the installed stripe package
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log(`Checkout session completed: ${session.id}`);

    try {
      await sendOrderEmail(session);
    } catch (error) {
      console.error('Failed to send order email:', error);
      // We still return 200 to Stripe to acknowledge receipt of the event
    }
  }

  return NextResponse.json({ received: true });
}
