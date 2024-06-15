import type { NextFunction, Request, Response } from 'express';

import { userService } from './userService';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user;

    const serviceResponse = await userService.findById(uid);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user;
    const update = req.body;

    const serviceResponse = await userService.update(uid, update);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};
