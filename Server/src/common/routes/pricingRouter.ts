import express from 'express';
import { z } from 'zod';

import { updatePricing } from '@/api/pricing/pricingController';
import { verifyAccessToken } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';

const router = express.Router();

const updatePricingSchema = z.object({
  body: z.object({
    roomId: z.string(),
    date: z.string().refine((val) => !Number.isNaN(Date.parse(val)), { message: 'Invalid date format' }),
    price: z.number().positive(),
  }),
});

router.put('/pricing', verifyAccessToken, validateRequest(updatePricingSchema), updatePricing);

export default router;
