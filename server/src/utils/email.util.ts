import nodemailer, { Transporter } from "nodemailer";

export class EmailUtil {
  static from: string = process.env.EMAIL_FROM;

  static async sendEmail(to: string, subject: string, html: string) {
    const transporterConfigVals = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    };

    try {
      const transporter: Transporter = nodemailer.createTransport(
        transporterConfigVals
      );
      const info = await transporter.sendMail({
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
