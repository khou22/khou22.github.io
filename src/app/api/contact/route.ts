import sgMail from "@sendgrid/mail";
import moment from "moment";
import { NextRequest } from "next/server";

export type ContactFormRequest = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
  timezone?: string;
};

/**
 * Contact form endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContactFormRequest = await request.json();

    if (!process.env.SENDGRID_API_KEY) {
      throw new Error("No Sendgrid API key found");
    }
    if (!process.env.CONTACT_FORM_ADDRESS) {
      throw new Error("No contact form address found");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const sendgridPayload: sgMail.MailDataRequired = {
      to: {
        // Must match verified senders: https://docs.sendgrid.com/for-developers/sending-email/sender-identity
        name: "Hello Kevin",
        email: process.env.CONTACT_FORM_ADDRESS,
      },
      from: {
        name: "Hello Kevin",
        email: process.env.CONTACT_FORM_ADDRESS,
      },
      subject: body.subject,
      content: [
        {
          type: "text/plain",
          value: `Name: ${body.full_name}
Email: ${body.email}
Subject: ${body.subject}
Sent At: ${moment().format("llll")}
${body.timezone ? `Timezone: ${body.timezone}\n` : ""}
${body.message}`,
        },
      ],
    };
    await sgMail.send(sendgridPayload);

    return new Response("Success", { status: 200 });
  } catch (error) {
    console.error(
      "Error sending contact form:",
      JSON.stringify(error, null, 2),
    );
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response(`An unexpected error occurred: ${error}`, {
      status: 500,
    });
  }
}
