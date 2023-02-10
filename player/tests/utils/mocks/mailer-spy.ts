import { Mailer } from "../../../src/application/ports/gateways/mailer";

export class MailerSpy implements Mailer {
  to: string;
  subject: string;
  body: string;

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    this.to = to;
    this.subject = subject;
    this.body = body;
  }
}
