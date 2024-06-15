import type { NextFunction, Request, Response } from 'express';

import { serviceService } from './serviceService';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const serviceResponse = await serviceService.createService(title, description);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { service: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    return next(error);
  }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await serviceService.getServices();

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { services: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sid } = req.params;
    const { title, description } = req.body;
    const serviceResponse = await serviceService.updateService(sid, title, description);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { service: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sid } = req.params;
    const serviceResponse = await serviceService.deleteService(sid);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
    });
  } catch (error) {
    return next(error);
  }
};
