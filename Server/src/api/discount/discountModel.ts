import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

import type { IDiscountPolicy } from './discountSchema';

const discountPolicySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    condition: { type: String, enum: ['week', 'month', 'custom'], required: true },
    minDays: { type: Number, required: true },
  },
  { timestamps: true }
);

const DiscountPolicyModel = mongoose.model<IDiscountPolicy & Document>(
  'DiscountPolicy',
  discountPolicySchema,
  'discountPolicies'
);

export default DiscountPolicyModel;
