import crypto from 'node:crypto';

import to from 'await-to-js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import type { ZodNumber, ZodOptional } from 'zod';
import z from 'zod';

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
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY, EMAIL_NAME, EMAIL_APP_PASSWORD } = env;

export const generateToken = (): string => {
  return crypto.randomBytes(20).toString('hex');
};

export function preprocessString<Schema extends z.ZodTypeAny>(schema: Schema, parseFunction: (value: string) => any) {
  return z.preprocess((value) => {
    if (typeof value === 'string') {
      try {
        return parseFunction(value);
      } catch {
        return undefined;
      }
    }

    return value;
  }, schema);
}

export const stringToNumber = (schema: ZodNumber | ZodOptional<z.ZodNumber>) =>
  preprocessString(schema, (value) => Number.parseInt(value, 10));

export const stringToFloat = (schema: ZodNumber | ZodOptional<z.ZodNumber>) =>
  preprocessString(schema, (value) => Number.parseFloat(value));

export const stringToDate = (schema: z.ZodTypeAny) => preprocessString(schema, (value) => new Date(value));

export const parseJson = (schema: z.ZodTypeAny) => preprocessString(schema, (value) => JSON.parse(value));

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
      user: EMAIL_NAME,
      pass: EMAIL_APP_PASSWORD,
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
