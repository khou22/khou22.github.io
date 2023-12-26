import sgMail from "@sendgrid/mail";
import moment from "moment";
import { NextRequest } from "next/server";

export type ContactFormRequest = {
  full_name: string;
  email: string;
  subject: string;
  message: string;
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

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const sendgridPayload = {
      to: process.env.CONTACT_FORM_ADDRESS,
      from: body.email,
      subject: body.subject,
      text: `Name: ${body.full_name}
Email: ${body.email}
Subject: ${body.subject}
Sent At: ${moment().format("llll")}

${body.message}`,
    };

    await sgMail.send(sendgridPayload);

    return new Response("Success", { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return new Response(error.message, { status: 500 });
    }
    return new Response(`An unexpected error occurred: ${error}`, {
      status: 500,
    });
  }
}
