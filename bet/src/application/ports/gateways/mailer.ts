export interface Mailer {
  sendMail(to: string, subject: string, body: any): Promise<void>;
}
