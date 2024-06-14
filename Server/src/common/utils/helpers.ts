import crypto from 'node:crypto';

import to from 'await-to-js';
import nodemailer from 'nodemailer';

interface SendMailOptions {
  email: string;
  html: string;
  subject: string;
}

export const generateToken = (): string => {
  return crypto.randomBytes(20).toString('hex');
};

export const sendMail = async ({ email, html, subject }: SendMailOptions): Promise<nodemailer.SentMessageInfo> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const [error, info] = await to(
    transporter.sendMail({
      from: '"Rent Apartment" <no-reply@rentapartment.com>',
      to: email,
      subject: subject,
      html: html,
    })
  );

  if (error) {
    throw error;
  }

  return info;
};
