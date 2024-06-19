import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import helmet from 'helmet';
import mogran from 'morgan';
import { pino } from 'pino';

import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { dbConnect } from '@/config/dbConfig';
import passport from '@/config/passportConfig';
import initRoutes from '@/routes';

const logger = pino({ name: 'server start' });
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(passport.initialize());
app.use(rateLimiter);
app.use(mogran('combined'));
// Request logging
app.use(requestLogger);

// Routes
initRoutes(app);
dbConnect();

// Error handlers
app.use(errorHandler());

export { app, logger };
