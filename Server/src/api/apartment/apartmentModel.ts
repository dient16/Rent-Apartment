import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

const COLLECTION = 'apartments';
const DOCUMENT = 'Apartment';

// Định nghĩa schema Zod
export const apartmentSchema = z.object({
  title: z.string(),
  location: z.object({
    longitude: z.number(),
    latitude: z.number(),
    province: z.string(),
    district: z.string(),
    ward: z.string().optional(),
    street: z.string(),
  }),
  createBy: z.string(), // Assuming ObjectId will be passed as a string
  rooms: z.array(z.string()).optional(), // Assuming ObjectId will be passed as a string
  images: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Apartment = z.infer<typeof apartmentSchema>;

// Định nghĩa schema Mongoose
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
