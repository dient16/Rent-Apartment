import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

import { commonValidations } from '@/common/utils/commonValidation';

extendZodWithOpenApi(z);

const COLLECTION = 'users';
const DOCUMENT = 'User';

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  password: z.string().optional(),
  avatar: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  personalId: z.string().optional(),
  isAdmin: z.boolean().default(false),
  address: z.string().optional(),
  aboutMe: z.string().optional(),
  favorites: z.array(z.string()).optional(),
  createApartments: z.array(z.string()).optional(),
  confirmationToken: z.string().optional(),
  emailConfirmed: z.boolean().default(false),
  refreshToken: z.string().optional(),
  provider: z.enum(['Email', 'Google', 'Facebook']).default('Email'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof UserSchema>;

const userMongooseSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    avatar: {
      type: String,
      default: '30b64d2bf8fe39eb2576e10c939b6689.png',
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
    },
    gender: {
      type: String,
    },
    personalId: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
      },
    ],
    createApartments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apartment',
      },
    ],
    confirmationToken: { type: String },
    emailConfirmed: { type: Boolean, default: false },
    refreshToken: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['Email', 'Google', 'Facebook'],
      default: 'Email',
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User & Document>(DOCUMENT, userMongooseSchema, COLLECTION);

export default UserModel;

// Input validation for 'get users/:id' endpoint
export const getUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
