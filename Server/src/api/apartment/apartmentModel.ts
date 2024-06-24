import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { Apartment } from './apartmentSchema';

const apartmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      long: { type: Number, required: true },
      lat: { type: Number, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      ward: { type: String },
      street: { type: String, required: true },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    images: [{ type: String, required: true }],
    houseRules: [{ type: String }],
    checkInTime: { type: String },
    checkOutTime: { type: String },
    safetyInfo: [{ type: String }],
    cancellationPolicy: { type: String },
    discounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discount' }],
  },
  { timestamps: true }
);

apartmentSchema.index({
  'location.province': 'text',
  'location.district': 'text',
  'location.ward': 'text',
  'location.street': 'text',
});

const ApartmentModel = mongoose.model<Apartment & Document>('Apartment', apartmentSchema, 'apartments');

export default ApartmentModel;
