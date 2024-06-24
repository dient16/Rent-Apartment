import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const DiscountPolicySchema = z.object({
  name: z.string(),
  description: z.string(),
  discountPercentage: z.number(),
  condition: z.enum(['week', 'month', 'custom']),
  minDays: z.number(),
});

export type IDiscountPolicy = z.infer<typeof DiscountPolicySchema>;
