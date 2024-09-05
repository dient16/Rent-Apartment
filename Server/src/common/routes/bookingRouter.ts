import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';

import * as controller from '@/api/booking/bookingController';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken } from '@/common/middleware/verifyToken';
import { BookingIdParamSchema, BookingSchema, GetBookingsSchema } from '@/api/booking/bookingSchema';

const router = Router();
export const bookingRegistry = new OpenAPIRegistry();
bookingRegistry.register('Booking', BookingSchema);

bookingRegistry.registerPath({
  method: 'get',
  path: '/bookings/:bookingId',
  tags: ['Booking'],
  request: {
    params: GetBookingsSchema,
  },
  responses: createApiResponse(BookingSchema, 'Success'),
});

bookingRegistry.registerPath({
  method: 'get',
  path: '/bookings',
  tags: ['Booking'],
  responses: createApiResponse(BookingSchema.array(), 'Success'),
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

bookingRegistry.registerPath({
  method: 'get',
  path: '/user/bookings',
  tags: ['Booking'],
  responses: createApiResponse(BookingSchema.array(), 'Success'),
});
bookingRegistry.registerPath({
  method: 'post',
  path: '/bookings/:bookingId/confirm',
  tags: ['Booking'],
  request: {
    params: BookingIdParamSchema,
  },
  responses: createApiResponse(BookingSchema, 'Booking confirmed successfully'),
});

router.get('/:bookingId', verifyAccessToken, controller.getBooking);
router.get('/', verifyAccessToken, controller.getBookings);
router.post('/', controller.createBooking);
router.post('/:bookingId/confirm', verifyAccessToken, controller.confirmBooking);
router.get('/user/bookings', verifyAccessToken, controller.getUserBookings);

export default router;
