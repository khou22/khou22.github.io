import { EmailService, EmailProvider } from "./EmailService";
import { SendgridProvider } from "./SendgridProvider";
import { MailgunProvider } from "./MailgunProvider";

export class EmailServiceFactory {
  static create(): EmailService {
    const provider =
      (process.env.EMAIL_PROVIDER as EmailProvider) || EmailProvider.MAILGUN;

    switch (provider) {
      case EmailProvider.MAILGUN:
        if (!process.env.MAILGUN_API_KEY) {
          throw new Error("No Mailgun API key found");
        }
        if (!process.env.MAILGUN_DOMAIN) {
          throw new Error("No Mailgun domain found");
        }
        return new MailgunProvider(
          process.env.MAILGUN_API_KEY,
          process.env.MAILGUN_DOMAIN,
        );

      case EmailProvider.SENDGRID:
        if (!process.env.SENDGRID_API_KEY) {
          throw new Error("No Sendgrid API key found");
        }
        return new SendgridProvider(process.env.SENDGRID_API_KEY);

      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  }
}
