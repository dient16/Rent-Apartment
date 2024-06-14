import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

extendZodWithOpenApi(z);

const COLLECTION = 'services';
const DOCUMENT = 'Service';

export const ServiceSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().default(''),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;

const serviceMongooseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<Service & Document>(DOCUMENT, serviceMongooseSchema, COLLECTION);

export default ServiceModel;
