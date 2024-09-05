import express from 'express';
import { z } from 'zod';

import { getPricingByRoomId, updatePricing } from '@/api/pricing/pricingController';
import { verifyAccessToken } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';
import { updatePricingSchema } from '@/api/pricing/pricingSchema';

const router = express.Router();
const getPricingByRoomIdSchema = z.object({
  params: z.object({
    roomId: z.string(),
  }),
});

router.get('/:roomId', verifyAccessToken, validateRequest(getPricingByRoomIdSchema), getPricingByRoomId);

router.put('/', verifyAccessToken, validateRequest(updatePricingSchema), updatePricing);

export default router;
