import type { NextFunction, Request, Response } from 'express';

import { bookingService } from './bookingService';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await bookingService.createBooking(req.body);
    return res.status(serviceResponse.statusCode).json(serviceResponse);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: userId } = req.user;
    const serviceResponse = await bookingService.getBookings(userId);
    return res.status(serviceResponse.statusCode).json(serviceResponse);
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookingId } = req.params;
    const serviceResponse = await bookingService.getBooking(bookingId);
    return res.status(serviceResponse.statusCode).json(serviceResponse);
  } catch (error) {
    next(error);
  }
};
