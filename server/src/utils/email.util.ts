import nodemailer, { Transporter } from "nodemailer";

export class EmailUtil {
  static transporter: Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static from: string = process.env.EMAIL_FROM;

  static async sendEmail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });

      console.log("Email sent", info);
    } catch (e) {
      console.log("Error sending email", e);
    }
  }
}
