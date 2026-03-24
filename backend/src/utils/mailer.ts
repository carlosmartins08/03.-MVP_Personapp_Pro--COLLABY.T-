import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@personaclinic.local",
    to,
    subject,
    text,
    html,
  });
}

