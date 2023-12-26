import { ContactFormRequest } from "@/app/api/contact/route";

/**
 * Sends a contact email.
 *
 * @param {string} name - The name of the person sending the email.
 * @param {string} email - The email address of the person sending the email.
 * @param {string} subject - The subject of the email.
 * @param {string} message - The message content of the email.
 * @return {Promise<void>} - A Promise that resolves when the email is sent.
 */
export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
): Promise<void> => {
  const payload: ContactFormRequest = {
    full_name: name,
    email,
    subject,
    message,
  };

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorText = `Error sending email with status ${response.status}: ${response.statusText}`;
    try {
      errorText = await response.text();
    } catch {}
    throw new Error(errorText);
  }
};
