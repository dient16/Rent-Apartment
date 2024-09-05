import type { Application } from 'express';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';

import { amenityRouter } from './amenityRouter';
import apartmentRouter from './apartmentRouter';
import authRouter from './authRouter';
import bookingRouter from './bookingRouter';
import imageRouter from './imageRouter';
import pricingRouter from './pricingRouter';
import roomRouter from './roomRouter';
import { swaggerRouter } from './swaggerRouter';
import { userRouter } from './userRouter';

const initRoutes = (app: Application) => {
  app.use('/health-check', healthCheckRouter);
  app.use('/api-docs', swaggerRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/amenity', amenityRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/apartment', apartmentRouter);
  app.use('/api/booking', bookingRouter);
  app.use('/api/pricing', pricingRouter);
  app.use('/api/room', roomRouter);
};

export default initRoutes;
