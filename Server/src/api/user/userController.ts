import type { NextFunction, Request, Response } from 'express';

import { userService } from './userService';

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user;

    const user = await userService.findById(uid);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: uid } = req.user;
    const update = req.body;

    const editedUser = await userService.update(uid, update, req.file);

    return res.status(200).json({
      success: true,
      data: { user: editedUser },
    });
  } catch (error) {
    next(error);
  }
};
