import { createTransport } from "nodemailer";

export let sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const transporter = createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  if (html) {
    const info = await transporter.sendMail({
      from: `"E_Commerce Application"<${process.env.USER_EMAIL}>`,
      to,
      subject,
      html,
    });
  } else {
    const info = await transporter.sendMail({
      from: `"E_Commerce Application"<${process.env.USER_EMAIL}>`,
      to,
      subject,
      attachments,
    });
  }
};
