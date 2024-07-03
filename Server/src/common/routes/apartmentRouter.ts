import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';

import * as controller from '@/api/apartment/apartmentController';
import {
  apartmentSchema,
  createApartmentSchema,
  getApartmentQuerySchema,
  searchRoomSchema,
} from '@/api/apartment/apartmentSchema';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';

export const apartmentRegistry = new OpenAPIRegistry();

apartmentRegistry.register('Apartment', apartmentSchema);

const router = Router();

apartmentRegistry.registerPath({
  method: 'post',
  path: '/api/apartment',
  tags: ['Apartment'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: apartmentSchema,
        },
      },
    },
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.post('/', verifyAccessToken, validateRequest(createApartmentSchema), controller.createApartment);

apartmentRegistry.registerPath({
  method: 'get',
  path: '/api/apartment/search',
  tags: ['Apartment'],
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.get('/search', validateRequest(searchRoomSchema), controller.searchApartments);

apartmentRegistry.registerPath({
  method: 'get',
  path: '/api/apartment/room/:roomId',
  tags: ['Apartment'],
  request: {
    params: z.object({
      roomId: z.string(),
    }),
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.get('/room/:roomId', controller.findRoomById);

apartmentRegistry.registerPath({
  method: 'get',
  path: '/api/apartment/by-user',
  tags: ['Apartment'],
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.get('/by-user', verifyAccessToken, controller.getApartmentsByUserId);

apartmentRegistry.registerPath({
  method: 'get',
  path: '/api/apartment',
  tags: ['Apartment'],
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.get('/', verifyAccessToken, controller.getAllApartment);

apartmentRegistry.registerPath({
  method: 'get',
  path: '/api/apartment/:apartmentId',
  tags: ['Apartment'],
  request: {
    params: z.object({
      apartmentId: z.string(),
    }),
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.get('/:apartmentId', validateRequest(getApartmentQuerySchema), controller.getApartmentDetail);

apartmentRegistry.registerPath({
  method: 'put',
  path: '/api/apartment/:apartmentId',
  tags: ['Apartment'],
  request: {
    params: z.object({
      apartmentId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: apartmentSchema,
        },
      },
    },
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.put('/:apartmentId', verifyAccessToken, controller.updateApartment);

apartmentRegistry.registerPath({
  method: 'delete',
  path: '/api/apartment/:apartmentId',
  tags: ['Apartment'],
  request: {
    params: z.object({
      apartmentId: z.string(),
    }),
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.delete('/:apartmentId', verifyAccessToken, controller.deleteApartment);

apartmentRegistry.registerPath({
  method: 'delete',
  path: '/api/apartment/room/:roomId',
  tags: ['Apartment'],
  request: {
    params: z.object({
      roomId: z.string(),
    }),
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.delete('/room/:roomId', verifyAccessToken, controller.removeRoomFromApartment);

apartmentRegistry.registerPath({
  method: 'post',
  path: '/api/apartment/create-stripe-payment',
  tags: ['Apartment'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            amount: z.number(),
            description: z.string(),
            source: z.string(),
          }),
        },
      },
    },
  },
  responses: createApiResponse(apartmentSchema, 'Success'),
});

router.post('/create-stripe-payment', controller.createStripePayment);

export default router;
