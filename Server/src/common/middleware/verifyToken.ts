import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { env } from '@/common/utils/envConfig';
const { JWT_ACCESS_KEY } = env;
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_ACCESS_KEY, (err, decode) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: false,
          message: 'Invalid access token',
        });
      }
      req.user = decode as IUserDecode;
      next();
    });
  } else {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: 'Require authentication!!!',
    });
  }
};

export const verifyIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserDecode;
  if (!user?.isAdmin) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: false,
      message: 'REQUIRE ADMIN ROLE',
    });
  }

  next();
};
