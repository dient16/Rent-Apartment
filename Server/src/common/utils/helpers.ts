import crypto from 'node:crypto';

import to from 'await-to-js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { env } from './envConfig';
interface SendMailOptions {
  email: string;
  html: string;
  subject: string;
}
interface JwtPayload {
  _id: string;
  isAdmin?: boolean;
}
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = env;

export const generateToken = (): string => {
  return crypto.randomBytes(20).toString('hex');
};

export const generateAccessToken = (uid: string, isAdmin: boolean): string => {
  return jwt.sign(
    {
      _id: uid,
      isAdmin,
    } as JwtPayload,
    JWT_ACCESS_KEY as string,
    { expiresIn: '7d' }
  );
};

export const generateRefreshToken = (uid: string): string => {
  return jwt.sign(
    {
      _id: uid,
    } as JwtPayload,
    JWT_REFRESH_KEY as string,
    { expiresIn: '365d' }
  );
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
