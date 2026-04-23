/**
 * Generic email service for sending order-related emails.
 * Currently mocks sending by logging to console.
 */

export interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

/**
 * Send an email.
 * 
 * @param options Email options including recipient, subject, and body.
 * @returns Promise that resolves when the email is "sent".
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  const { to, subject, body, html } = options;

  // Mock sending email
  console.log('--- EMAIL SERVICE: SENDING EMAIL ---');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  if (html) {
    console.log(`HTML: ${html.substring(0, 100)}...`);
  }
  console.log('--- EMAIL SERVICE: EMAIL SENT SUCCESSFULLY ---');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return true;
};

/**
 * Send a digital delivery email with download links.
 */
export const sendDigitalDeliveryEmail = async (
  customerEmail: string,
  orderId: number,
  items: { title: string; downloadLink: string }[]
): Promise<boolean> => {
  const subject = `Your Digital Downloads from Order #${orderId}`;
  
  const itemLinks = items
    .map((item) => `- ${item.title}: ${item.downloadLink}`)
    .join('\n');

  const body = `
Thank you for your order!

Your digital downloads are ready:

${itemLinks}

If you have any issues, please reply to this email.

Best,
Kevin Hou Photography
  `.trim();

  const html = `
    <h1>Thank you for your order!</h1>
    <p>Your digital downloads are ready:</p>
    <ul>
      ${items
        .map(
          (item) =>
            `<li><strong>${item.title}</strong>: <a href="${item.downloadLink}">Download Here</a></li>`
        )
        .join('')}
    </ul>
    <p>If you have any issues, please reply to this email.</p>
    <p>Best,<br/>Kevin Hou Photography</p>
  `;

  return sendEmail({
    to: customerEmail,
    subject,
    body,
    html,
  });
};
