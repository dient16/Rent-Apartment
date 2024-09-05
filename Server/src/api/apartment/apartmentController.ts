import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/serviceResponse/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import type { SearchRoomType } from './apartmentSchema';
import { apartmentService } from './apartmentService';

export const getAllApartment = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await apartmentService.getAllApartments();
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const getUserApartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await apartmentService.getUserApartments(req.user._id);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const getPopularRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const serviceResponse = await apartmentService.getPopularRooms(limit);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const getApartmentDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;

    const serviceResponse = await apartmentService.getApartmentDetail(apartmentId, req.query as any);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const createApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: userId } = req.user as UserDecode;

    const serviceResponse = await apartmentService.createApartment(userId, req.body);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const searchApartments = async (req: SearchRoomType & Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(startDate) < today || new Date(endDate) < today) {
      return handleServiceResponse(
        new ServiceResponse<null>(
          ResponseStatus.Failed,
          "The start date and end date must be on or after today's date",
          null,
          StatusCodes.BAD_REQUEST
        ),
        res
      );
    }

    const serviceResponse = await apartmentService.searchApartments(req.query);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const updateApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const { _id: updatedBy } = req.user as UserDecode;
    const serviceResponse = await apartmentService.updateApartment(apartmentId, req.body, updatedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const deleteApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const { _id: deletedBy } = req.user as UserDecode;
    const serviceResponse = await apartmentService.deleteApartment(apartmentId, deletedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const removeRoomFromApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId, roomId } = req.params;
    const { _id: removedBy } = req.user as UserDecode;
    const serviceResponse = await apartmentService.removeRoomFromApartment(apartmentId, roomId, removedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const getRoomsCheckout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomIds: string[] = req.query.roomIds as string[];
    const roomNumbers: string[] = req.query.roomNumbers as string[];

    if (roomIds.length !== roomNumbers.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: ResponseStatus.Failed,
        message: 'Mismatch between roomIds and roomNumbers length.',
      });
    }

    const { roomIds: _roomIds, roomNumbers: _roomNumbers, ...query } = req.query;

    const serviceResponse = await apartmentService.getRoomsCheckout(roomIds, roomNumbers, query);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const createStripePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, description, source } = req.body;
    const serviceResponse = await apartmentService.createStripePayment(amount, description, source);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const getApartmentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: userId } = req.user as UserDecode;
    const serviceResponse = await apartmentService.getApartmentsByUserId(userId);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
