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
    },
    roomType: { type: String, required: true },
    amenityies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity', required: true }],
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    images: [{ type: String, required: true }],
    unavailableDateRanges: [{ startDay: { type: Date }, endDay: { type: Date } }],
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
