import moment from "moment";
import { NextRequest } from "next/server";
import { EmailServiceFactory } from "@/services/email/EmailServiceFactory";

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

    if (!process.env.CONTACT_FORM_ADDRESS) {
      throw new Error("No contact form address found");
    }

    const emailService = EmailServiceFactory.create();
    const emailContent = `Name: ${body.full_name}
Email: ${body.email}
Subject: ${body.subject}
Sent At: ${moment().format("llll")}
${body.timezone ? `Timezone: ${body.timezone}\n` : ""}
${body.message}`;

    await emailService.sendEmail({
      to: {
        name: "Hello Kevin",
        email: process.env.CONTACT_FORM_ADDRESS,
      },
      from: {
        name: "Hello Kevin",
        email: process.env.CONTACT_FORM_ADDRESS,
      },
      subject: body.subject,
      content: emailContent,
    });

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
