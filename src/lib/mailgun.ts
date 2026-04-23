import axios from 'axios';
import FormData from 'form-data';

/**
 * Sends an order notification email using Mailgun API via Axios.
 * @param session The Stripe Checkout Session object.
 */
export const sendOrderEmail = async (session: any) => {
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;

  if (!domain || !apiKey) {
    console.warn('Mailgun domain or API key missing, skipping email notification.');
    return;
  }

  const customerEmail = session.customer_details?.email || session.customer_email;
  const amountTotal = session.amount_total / 100;
  const sessionId = session.id;

  const form = new FormData();
  form.append('from', `Store Notifications <postmaster@${domain}>`);
  // Default to notifying the customer or an admin email if configured
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL || customerEmail;
  form.append('to', recipient);
  form.append('subject', `Order Confirmation - ${sessionId}`);
  form.append('text', `
New order received!

Customer Email: ${customerEmail}
Total Amount: $${amountTotal.toFixed(2)}
Stripe Session ID: ${sessionId}

Thank you for your purchase!
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
    console.error('Error sending email via Mailgun:', error.response?.data || error.message);
    throw error;
  }
};
