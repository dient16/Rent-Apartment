import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const PricingSchema = z.object({
  roomId: z.string(),
  date: z.date(),
  price: z.number(),
});

export type Pricing = z.infer<typeof PricingSchema>;
