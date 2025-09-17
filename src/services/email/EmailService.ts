export interface EmailRequest {
  to: { name: string; email: string };
  from: { name: string; email: string };
  subject: string;
  content: string;
}

export interface EmailService {
  sendEmail(emailData: EmailRequest): Promise<void>;
}

export enum EmailProvider {
  SENDGRID = "sendgrid",
  MAILGUN = "mailgun",
}
