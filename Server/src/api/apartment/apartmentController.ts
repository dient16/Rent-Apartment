import type { NextFunction, Request, Response } from 'express';

import { apartmentService } from './apartmentService';

export const getAllApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await apartmentService.getAllApartments();
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartments: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const getApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const serviceResponse = await apartmentService.getApartment(apartmentId, req.query);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartment: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const createApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, rooms, location } = req.body;
    const { _id: createBy } = req.user;
    const serviceResponse = await apartmentService.createApartment(createBy, title, rooms, location, req.files);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartment: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const searchApartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await apartmentService.searchApartments(req.query);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const { _id: updatedBy } = req.user;
    const serviceResponse = await apartmentService.updateApartment(apartmentId, req.body, updatedBy);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartment: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId } = req.params;
    const { _id: deletedBy } = req.user;
    const serviceResponse = await apartmentService.deleteApartment(apartmentId, deletedBy);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartment: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const removeRoomFromApartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apartmentId, roomId } = req.params;
    const { _id: removedBy } = req.user;
    const serviceResponse = await apartmentService.removeRoomFromApartment(apartmentId, roomId, removedBy);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartment: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const findRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roomId } = req.params;
    const serviceResponse = await apartmentService.findRoomById(roomId, req.query);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { room: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const createStripePayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, description, source } = req.body;
    const serviceResponse = await apartmentService.createStripePayment(amount, description, source);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { clientSecret: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const getApartmentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: userId } = req.user;
    const serviceResponse = await apartmentService.getApartmentsByUserId(userId);
    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { apartments: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};
