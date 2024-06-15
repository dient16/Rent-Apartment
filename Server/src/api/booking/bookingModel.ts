import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

const COLLECTION: string = 'bookings';
const DOCUMENT: string = 'Booking';

export const BookingSchema = z.object({
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string(),
  room: z.string(),
  arrivalTime: z.string(),
  checkInTime: z.date(),
  checkOutTime: z.date(),
  totalPrice: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const GetBookingSchema = z.object({
  bookingId: z.string(),
});

export const GetBookingsSchema = z.object({
  userId: z.string(),
});
export type IBooking = z.infer<typeof BookingSchema>;

const bookingMongooseSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    arrivalTime: { type: String, required: true },
    checkInTime: { type: Date, required: true },
    checkOutTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model<IBooking & Document>(DOCUMENT, bookingMongooseSchema, COLLECTION);

export default BookingModel;
