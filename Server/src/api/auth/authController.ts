import type { NextFunction, Request, Response } from 'express';

import { authService } from './authService';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const serviceResponse = await authService.register(email);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query as { token: string };
    const serviceResponse = await authService.confirmEmail(token);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const setPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, password } = req.body;
    const serviceResponse = await authService.setPassword(userId, password);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const serviceResponse = await authService.login(email, password);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
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

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const serviceResponse = await authService.refreshAccessToken(refreshToken);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { accessToken: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const googleLoginSuccess = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const serviceResponse = await authService.googleLoginSuccess(userId);

    return res.status(serviceResponse.statusCode).json({
      success: serviceResponse.success,
      message: serviceResponse.message,
      data: serviceResponse.responseObject ? { user: serviceResponse.responseObject } : undefined,
    });
  } catch (error) {
    next(error);
  }
};
