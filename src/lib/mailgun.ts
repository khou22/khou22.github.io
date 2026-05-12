import axios from 'axios';
import FormData from 'form-data';

/**
 * Sends an order notification email to the site admin using Mailgun API.
 *
 * This is an internal notification only — it alerts the admin that a new order
 * has been placed. Customer-facing order confirmations and receipts are handled
 * directly by Stripe (enable in Stripe Dashboard → Settings → Emails).
 *
 * Requires the following environment variables:
 * - MAILGUN_DOMAIN: The Mailgun sending domain
 * - MAILGUN_API_KEY: The Mailgun API key
 * - ORDER_NOTIFICATION_EMAIL: The admin email to receive order notifications
 */
export const sendAdminOrderNotification = async (session: any) => {
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL;

  if (!domain || !apiKey) {
    console.warn('Mailgun domain or API key missing, skipping admin order notification.');
    return;
  }

  if (!adminEmail) {
    console.warn('ORDER_NOTIFICATION_EMAIL not set, skipping admin order notification.');
    return;
  }

  const customerEmail = session.customer_details?.email || session.customer_email;
  const amountTotal = session.amount_total / 100;
  const sessionId = session.id;

  const form = new FormData();
  form.append('from', `Store Notifications <postmaster@${domain}>`);
  form.append('to', adminEmail);
  form.append('subject', `New Order Received - ${sessionId}`);
  form.append('text', `
New order received!

Customer Email: ${customerEmail}
Total Amount: $${amountTotal.toFixed(2)}
Stripe Session ID: ${sessionId}

View full details in the Stripe Dashboard:
https://dashboard.stripe.com/payments

Note: The customer will receive their receipt directly from Stripe.
  `.trim());

  try {
    const authHeader = `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`;
    const response = await axios.post(
      `https://api.mailgun.net/v3/${domain}/messages`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: authHeader,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error sending admin order notification via Mailgun:', error.response?.data || error.message);
    throw error;
  }
};
