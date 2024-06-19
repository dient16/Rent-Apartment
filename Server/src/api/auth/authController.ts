import type { NextFunction, Request, Response } from 'express';

import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { authService } from './authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const serviceResponse = await authService.register(email);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query as { token: string };
    const serviceResponse = await authService.confirmEmail(token);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body;
    const serviceResponse = await authService.setPassword(userId, password);
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const serviceResponse = await authService.login(email, password);
    if (serviceResponse.success && serviceResponse.data) {
      const { refreshToken } = serviceResponse.data;
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });
    }
    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const serviceResponse = await authService.logout(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const serviceResponse = await authService.refreshAccessToken(refreshToken);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};

export const googleLoginSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const serviceResponse = await authService.googleLoginSuccess(userId);

    handleServiceResponse(serviceResponse, res);
  } catch (error) {
    next(error);
  }
};
