import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

const COLLECTION = 'rooms';
const DOCUMENT = 'Room';

export const roomSchema = z.object({
  apartmentId: z.string(),
  services: z.array(z.string()),
  description: z.string(),
  size: z.number(),
  price: z.number(),
  images: z.array(z.string()),
  unavailableDateRanges: z
    .array(
      z.object({
        startDay: z.date(),
        endDay: z.date(),
      })
    )
    .optional(),
  roomType: z.string(),
  numberOfGuest: z.number(),
  reviews: z
    .array(
      z.object({
        score: z.number(),
        comment: z.string().optional(),
        postedBy: z.string(),
      })
    )
    .optional(),
  quantity: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Room = z.infer<typeof roomSchema>;

const roomMongooseSchema = new mongoose.Schema(
  {
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
    description: { type: String, required: true },
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    unavailableDateRanges: [{ startDay: { type: Date }, endDay: { type: Date } }],
    roomType: { type: String, required: true },
    numberOfGuest: { type: Number, required: true },
    reviews: [
      {
        score: { type: Number },
        comment: { type: String },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model<Room & Document>(DOCUMENT, roomMongooseSchema, COLLECTION);

export default RoomModel;
