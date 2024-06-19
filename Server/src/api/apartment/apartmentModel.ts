import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

import { parseJson, stringToDate, stringToFloat, stringToNumber } from '@/common/utils/helpers';

import { userDecodeSchema } from '../user/userModel';

extendZodWithOpenApi(z);

const COLLECTION = 'apartments';
const DOCUMENT = 'Apartment';
export const locationSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  province: z.string(),
  district: z.string(),
  ward: z.string().optional(),
  street: z.string(),
});
export const apartmentSchema = z.object({
  title: z.string(),
  location: locationSchema,
  createBy: z.string(),
  rooms: z.array(z.string()).optional(),
  images: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const searchRoomSchema = z.object({
  query: z.object({
    numberOfGuest: stringToNumber(z.number()).optional().default(1),
    roomNumber: stringToNumber(z.number()).optional().default(1),
    province: z.string(),
    limit: stringToNumber(z.number()).optional().default(10),
    page: stringToNumber(z.number()).optional().default(1),
    district: z.string().optional(),
    ward: z.string().optional(),
    street: z.string().optional(),
    startDate: stringToDate(z.date()),
    endDate: stringToDate(z.date()),
    name: z.string().optional(),
    minPrice: stringToFloat(z.number()).optional().default(0),
    maxPrice: stringToFloat(z.number()).optional().default(Number.MAX_VALUE),
  }),
});

const roomSchema = z.object({
  services: z.array(z.string()),
  description: z.string(),
  size: z.number(),
  price: z.number(),
  roomType: z.string(),
  numberOfGuest: z.number(),
  quantity: z.number(),
});

export const createApartmentSchema = z.object({
  body: z.object({
    title: parseJson(z.string()),
    rooms: parseJson(z.array(roomSchema)),
    location: parseJson(locationSchema),
  }),
  user: userDecodeSchema,
});
export type Apartment = z.infer<typeof apartmentSchema>;
export type Location = z.infer<typeof locationSchema>;
export type SearchRoomType = z.infer<typeof searchRoomSchema>;
export type CreateRoom = z.infer<typeof roomSchema>;

const apartmentMongooseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String },
      street: { type: String, required: true },
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  }
);

apartmentMongooseSchema.index({
  'location.province': 'text',
  'location.district': 'text',
  'location.ward': 'text',
  'location.street': 'text',
});

const ApartmentModel = mongoose.model<Apartment & Document>(DOCUMENT, apartmentMongooseSchema, COLLECTION);

export default ApartmentModel;
