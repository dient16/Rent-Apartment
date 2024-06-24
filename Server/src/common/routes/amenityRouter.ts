import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';

import * as controller from '@/api/amenity/amenityController';
import { amenitySchema } from '@/api/amenity/amenitySchema';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken, verifyIsAdmin } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';

import { commonValidations } from '../utils/commonValidation';

export const amenityRegistry = new OpenAPIRegistry();

amenityRegistry.register('Amenity', amenitySchema);

export const amenityRouter: Router = (() => {
  const router = Router();

  amenityRegistry.registerPath({
    method: 'get',
    path: '/api/amenity',
    tags: ['Amenity'],
    responses: createApiResponse(amenitySchema.array(), 'Success'),
  });

  router.get('/', controller.getAmenities);

  amenityRegistry.registerPath({
    method: 'post',
    path: '/api/amenity',
    tags: ['Amenity'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: amenitySchema.omit({ _id: true, createdAt: true, updatedAt: true }),
          },
        },
      },
    },
    responses: createApiResponse(amenitySchema, 'Success'),
  });

  router.post(
    '/',
    validateRequest(amenitySchema.omit({ _id: true, createdAt: true, updatedAt: true })),
    controller.createAmenity
  );

  amenityRegistry.registerPath({
    method: 'put',
    path: '/api/amenity/{aid}',
    tags: ['Amenity'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: amenitySchema.omit({ _id: true, createdAt: true, updatedAt: true }),
          },
        },
      },
      params: z.object({ aid: z.string() }),
    },
    responses: createApiResponse(amenitySchema, 'Success'),
  });

  router.put(
    '/:aid',
    verifyAccessToken,
    verifyIsAdmin,
    validateRequest(
      z.object({
        body: amenitySchema.omit({ _id: true, createdAt: true, updatedAt: true }),
        params: z.object({ aid: z.string() }),
      })
    ),
    controller.updateAmenity
  );

  amenityRegistry.registerPath({
    method: 'delete',
    path: '/api/amenity/{aid}',
    tags: ['Amenity'],
    request: {
      params: z.object({ aid: commonValidations.id }),
    },
    responses: createApiResponse(amenitySchema, 'Success'),
  });

  router.delete(
    '/:aid',
    verifyAccessToken,
    verifyIsAdmin,
    validateRequest(
      z.object({
        params: z.object({ aid: commonValidations.id }),
      })
    ),
    controller.deleteAmenity
  );
  return router;
})();
