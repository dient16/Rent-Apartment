import type { NextFunction, Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { pricingService } from './pricingService';

export const updatePricing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId, date, price } = req.body;

    const serviceResponse = await pricingService.updatePricing(roomId, new Date(date), price);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const getPricingByRoomId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;

    const serviceResponse = await pricingService.getPricingByRoomId(roomId);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
