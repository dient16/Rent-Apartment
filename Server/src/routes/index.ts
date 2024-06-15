import type { Application } from 'express';

// import { errHandler, notFound } from '../middlewares/errorHandler';
import apartmentRouter from './apartmentRouter';
import authRouter from './authRouter';
import bookingRouter from './bookingRouter';
import imageRouter from './imageRouter';
import { serviceRouter } from './serviceRouter';
// import swaggerRouter from './swaggerRouter';
import { userRouter } from './userRouter';

const initRoutes = (app: Application) => {
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use('/api/service', serviceRouter);
  app.use('/api/image', imageRouter);
  app.use('/api/apartment', apartmentRouter);
  app.use('/api/booking', bookingRouter);
  // app.use('/api-docs', swaggerRouter);

  // app.use(notFound);
  // app.use(errHandler);
};

export default initRoutes;
