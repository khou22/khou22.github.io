import Mailgun from "mailgun.js";
import { EmailService, EmailRequest } from "./EmailService";

// Note: Requires 'mailgun.js' and 'form-data' packages to be installed
// Run: pnpm add mailgun.js form-data
const formData = require('form-data');
const mailgun = new Mailgun(formData);

export class MailgunProvider implements EmailService {
  private mg: ReturnType<typeof mailgun.client>;
  private domain: string;

  constructor(apiKey: string, domain: string) {
    this.mg = mailgun.client({
      username: "api",
      key: apiKey,
    });
    this.domain = domain;
  }

  async sendEmail(emailData: EmailRequest): Promise<void> {
    const mailgunPayload = {
      from: `${emailData.from.name} <${emailData.from.email}>`,
      to: `${emailData.to.name} <${emailData.to.email}>`,
      subject: emailData.subject,
      text: emailData.content,
    };

    await this.mg.messages.create(this.domain, mailgunPayload);
  }
}
