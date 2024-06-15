import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';

import * as controller from '@/api/booking/bookingController';
import { BookingSchema, GetBookingSchema } from '@/api/booking/bookingModel';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken } from '@/common/middleware/verifyToken';

const router = Router();
export const bookingRegistry = new OpenAPIRegistry();
bookingRegistry.register('Booking', BookingSchema);

bookingRegistry.registerPath({
  method: 'get',
  path: '/bookings/:bookingId',
  tags: ['Booking'],
  request: {
    params: GetBookingSchema,
  },
  responses: createApiResponse(BookingSchema, 'Success'),
  security: [{ bearerauth: [] }],
});

bookingRegistry.registerPath({
  method: 'get',
  path: '/bookings',
  tags: ['Booking'],
  responses: createApiResponse(BookingSchema.array(), 'Success'),
  security: [{ bearerauth: [] }],
});

bookingRegistry.registerPath({
  method: 'post',
  path: '/bookings',
  tags: ['Booking'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: BookingSchema,
        },
      },
    },
  },
  responses: createApiResponse(BookingSchema, 'Success'),
});

router.get('/:bookingId', verifyAccessToken, controller.getBooking);
router.get('/', verifyAccessToken, controller.getBookings);
router.post('/', controller.createBooking);

export default router;
