import type { Application } from 'express';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';

import apartmentRouter from './apartmentRouter';
import authRouter from './authRouter';
import bookingRouter from './bookingRouter';
import imageRouter from './imageRouter';
import { serviceRouter } from './serviceRouter';
import { swaggerRouter } from './swaggerRouter';
import { userRouter } from './userRouter';

const initRoutes = (app: Application) => {
  app.use('/health-check', healthCheckRouter);
  app.use('/api-docs', swaggerRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/service', serviceRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/apartment', apartmentRouter);
  app.use('/api/booking', bookingRouter);
};

export default initRoutes;
