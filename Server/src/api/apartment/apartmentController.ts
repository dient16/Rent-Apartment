import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/schemaResponse/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import type { SearchRoomType } from './apartmentModel';
import { apartmentService } from './apartmentService';

export const getAllApartment = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await apartmentService.getAllApartments();
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const getApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const serviceResponse = await apartmentService.getApartment(apartmentId, req.query);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const createApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, location, rooms } = req.body;
    const files = req.files;
    const { _id: userId } = req.user as IUserDecode;

    const serviceResponse = await apartmentService.createApartment(
      userId,
      title,
      rooms,
      location,
      files as Express.Multer.File[]
    );

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
export const searchApartments = async (req: SearchRoomType & Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const today = new Date();

    if (startDate < today || endDate < today) {
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
    const { _id: updatedBy } = req.user as IUserDecode;
    const serviceResponse = await apartmentService.updateApartment(apartmentId, req.body, updatedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const deleteApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const { _id: deletedBy } = req.user as IUserDecode;
    const serviceResponse = await apartmentService.deleteApartment(apartmentId, deletedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const removeRoomFromApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId, roomId } = req.params;
    const { _id: removedBy } = req.user as IUserDecode;
    const serviceResponse = await apartmentService.removeRoomFromApartment(apartmentId, roomId, removedBy);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const findRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const serviceResponse = await apartmentService.findRoomById(roomId, req.query);
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
    const { _id: userId } = req.user as IUserDecode;
    const serviceResponse = await apartmentService.getApartmentsByUserId(userId);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
