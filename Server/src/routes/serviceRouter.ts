import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';

import * as controller from '@/api/service/serviceController';
import { ServiceSchema } from '@/api/service/serviceModel';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken, verifyIsAdmin } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';

export const serviceRegistry = new OpenAPIRegistry();

serviceRegistry.register('Service', ServiceSchema);

export const serviceRouter: Router = (() => {
  const router = Router();

  serviceRegistry.registerPath({
    method: 'get',
    path: '/api/service',
    tags: ['Service'],
    responses: createApiResponse(ServiceSchema.array(), 'Success'),
  });

  router.get('/', controller.getServices);

  serviceRegistry.registerPath({
    method: 'post',
    path: '/api/service',
    tags: ['Service'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ServiceSchema.omit({ _id: true }),
          },
        },
      },
    },
    responses: createApiResponse(ServiceSchema, 'Success'),
    security: [{ BearerAuth: [] }],
  });

  router.post('/', controller.createService);

  serviceRegistry.registerPath({
    method: 'put',
    path: '/api/service/{sid}',
    tags: ['Service'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: ServiceSchema.omit({ _id: true }),
          },
        },
      },
      params: z.object({ sid: z.string() }),
    },
    responses: createApiResponse(ServiceSchema, 'Success'),
    security: [{ BearerAuth: [] }],
  });

  router.put('/:sid', verifyAccessToken, verifyIsAdmin, validateRequest(ServiceSchema), controller.updateService);

  serviceRegistry.registerPath({
    method: 'delete',
    path: '/api/service/{sid}',
    tags: ['Service'],
    request: {
      params: z.object({ sid: z.string() }),
    },
    responses: createApiResponse(ServiceSchema, 'Success'),
    security: [{ BearerAuth: [] }],
  });
  router.delete('/:sid', verifyAccessToken, verifyIsAdmin, controller.deleteService);

  return router;
})();
