import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: config.ETHEREAL_USER,
    pass: config.ETHEREAL_PWD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: '"Mable Armstrong" <mable81@ethereal.email>',
    to,
    subject,
    html,
  });
  // console.log(info);
};
