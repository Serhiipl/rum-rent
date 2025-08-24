// "use server";
// import sgMail from "@sendgrid/mail";

// export async function sendEmail({
//   to,
//   subject,
//   text,
// }: {
//   to: string;
//   subject: string;
//   text: string;
// }) {
//   if (!process.env.SENDGRID_API_KEY) {
//     throw new Error("SENDGRID_API_KEY environment variable is not set");
//   }
//   if (!process.env.EMAIL_FROM) {
//     throw new Error("EMAIL_FROM environment variable is not set");
//   }

//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//   const message = {
//     to: to.toLowerCase().trim(),
//     from: process.env.EMAIL_FROM,
//     subject: subject.trim(),
//     text: text.trim(),
//   };

//   try {
//     const [response] = await sgMail.send(message);

//     if (response.statusCode !== 202) {
//       throw new Error(
//         `SendGrid API returned status code ${response.statusCode}`
//       );
//     }

//     return {
//       success: true,
//       messageId: response.headers["x-message-id"],
//     };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return {
//       success: false,
//       message: "Failed to send email. Please try again later.",
//     };
//   }
// }
"use server";

import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER or SMTP_PASS environment variable is not set");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM environment variable is not set");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to.toLowerCase().trim(),
    subject: subject.trim(),
    text: text.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
