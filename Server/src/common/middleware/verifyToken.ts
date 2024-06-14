import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../utils/envConfig';
const { JWT_ACCESS_KEY } = env;
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_ACCESS_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid access token',
        });
      }
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      status: 'fail',
      message: 'Require authentication!!!',
    });
  }
};

export const verifyIsAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { isAdmin } = req.user;
  if (!isAdmin) {
    return res.status(401).json({
      status: 'fail',
      message: 'REQUIRE ADMIN ROLE',
    });
  }
  next();
};
