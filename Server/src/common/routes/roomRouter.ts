import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { z } from 'zod';

import * as controller from '@/api/room/roomController';
import { createRoomSchema, roomSchema, updateRoomSchema } from '@/api/room/roomSchema';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import upload from '@/common/middleware/uploadFile';
import { verifyAccessToken } from '@/common/middleware/verifyToken';
import { validateRequest } from '@/common/utils/httpHandlers';

export const roomRegistry = new OpenAPIRegistry();

roomRegistry.register('Room', roomSchema);

const router = Router();

roomRegistry.registerPath({
  method: 'post',
  path: '/api/room',
  tags: ['Room'],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: createRoomSchema,
        },
      },
    },
  },
  responses: createApiResponse(roomSchema, 'Success'),
});

router.post('/', verifyAccessToken, upload.any(), validateRequest(createRoomSchema), controller.addRoomToApartment);

roomRegistry.registerPath({
  method: 'get',
  path: '/api/room/:roomId',
  tags: ['Room'],
  request: {
    params: z.object({
      roomId: z.string(),
    }),
  },
  responses: createApiResponse(roomSchema, 'Success'),
});

router.get('/:roomId', controller.findRoomById);

roomRegistry.registerPath({
  method: 'put',
  path: '/api/room/:roomId',
  tags: ['Room'],
  request: {
    params: z.object({
      roomId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateRoomSchema,
        },
      },
    },
  },
  responses: createApiResponse(roomSchema, 'Success'),
});

router.put('/:roomId', verifyAccessToken, validateRequest(updateRoomSchema), controller.updateRoom);

roomRegistry.registerPath({
  method: 'delete',
  path: '/api/room/:roomId',
  tags: ['Room'],
  request: {
    params: z.object({
      roomId: z.string(),
    }),
  },
  responses: createApiResponse(roomSchema, 'Success'),
});

router.delete('/:roomId', verifyAccessToken, controller.deleteRoom);

export default router;
