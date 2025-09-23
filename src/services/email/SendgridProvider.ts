import sgMail from "@sendgrid/mail";
import { EmailService, EmailRequest } from "./EmailService";

export class SendgridProvider implements EmailService {
  constructor(private _apiKey: string) {
    sgMail.setApiKey(this._apiKey);
  }

  async sendEmail(emailData: EmailRequest): Promise<void> {
    const sendgridPayload: sgMail.MailDataRequired = {
      to: {
        name: emailData.to.name,
        email: emailData.to.email,
      },
      from: {
        name: emailData.from.name,
        email: emailData.from.email,
      },
      subject: emailData.subject,
      content: [
        {
          type: "text/plain",
          value: emailData.content,
        },
      ],
    };

    await sgMail.send(sendgridPayload);
  }
}
