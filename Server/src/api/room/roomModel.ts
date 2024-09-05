import type { Document } from 'mongoose';
import mongoose from 'mongoose';

import type { Room } from './roomSchema';

const COLLECTION = 'rooms';
const DOCUMENT = 'Room';

const roomMongooseSchema = new mongoose.Schema(
  {
    apartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      index: true,
    },
    roomType: { type: String, required: true },
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity', required: true }],
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    unavailableDateRanges: [{ startDay: { type: Date }, endDay: { type: Date } }],
    numberOfGuest: { type: Number, required: true },
    bedType: { type: String, required: true },
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
roomMongooseSchema.methods.isAvailable = function (date: Date): boolean {
  if (!this.unavailableDateRanges) {
    return true;
  }
  return !this.unavailableDateRanges.some(
    (range: { startDay: Date; endDay: Date }) => date >= range.startDay && date <= range.endDay
  );
};
const RoomModel = mongoose.model<Room & Document & { isAvailable: (date: Date) => boolean }>(
  DOCUMENT,
  roomMongooseSchema,
  COLLECTION
);

export default RoomModel;
