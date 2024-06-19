import type { NextFunction, Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { serviceService } from './serviceService';

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description } = req.body;
    const serviceResponse = await serviceService.createService(title, description);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    return next(error);
  }
};

export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceResponse = await serviceService.getServices();
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    return next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sid } = req.params;
    const { title, description } = req.body;
    const serviceResponse = await serviceService.updateService(sid, title, description);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    return next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sid } = req.params;
    const serviceResponse = await serviceService.deleteService(sid);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    return next(error);
  }
};
