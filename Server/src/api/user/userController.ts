import type { NextFunction, Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { userService } from './userService';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user as IUserDecode;

    const serviceResponse = await userService.findById(uid);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user as IUserDecode;
    const update = req.body;

    const serviceResponse = await userService.update(uid, update);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
