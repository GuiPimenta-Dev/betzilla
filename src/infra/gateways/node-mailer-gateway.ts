import nodemailer from "nodemailer";
import { Mailer } from "../../application/ports/gateways/mailer";

export class NodeMailerGateway implements Mailer {
  transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    var mailOptions = {
      from: {
        name: "Dandeliun",
        address: "guilherme@goentri.com",
      },
      to,
      subject,
      text: body,
    };
    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
    });
  }
}
