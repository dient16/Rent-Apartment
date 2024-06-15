import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import passport from 'passport';
import { z } from 'zod';

import * as controller from '@/api/auth/authController';
import { userLoginSchema, userSignUpSchema } from '@/api/auth/authModel';
import { UserSchema } from '@/api/user/userModel';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { verifyAccessToken } from '@/common/middleware/verifyToken';

export const authRegistry = new OpenAPIRegistry();

authRegistry.register('User', UserSchema);

const router = Router();

authRegistry.registerPath({
  method: 'post',
  path: '/register',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userSignUpSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

router.post('/register', controller.register);

authRegistry.registerPath({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: userLoginSchema,
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

router.post('/login', controller.login);

authRegistry.registerPath({
  method: 'get',
  path: '/logout',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get('/logout', verifyAccessToken, controller.logout);

authRegistry.registerPath({
  method: 'post',
  path: '/refresh-token',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.post('/refresh-token', verifyAccessToken, controller.refreshAccessToken);

authRegistry.registerPath({
  method: 'get',
  path: '/confirm-email',
  tags: ['Auth'],
  request: {
    query: z.object({
      token: z.string(),
    }),
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get('/confirm-email', controller.confirmEmail);

authRegistry.registerPath({
  method: 'post',
  path: '/set-password',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            userId: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

router.post('/set-password', controller.setPassword);

authRegistry.registerPath({
  method: 'get',
  path: '/google',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

authRegistry.registerPath({
  method: 'get',
  path: '/google/callback',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/signin-success/${req.user?._id}`);
  }
);

authRegistry.registerPath({
  method: 'get',
  path: '/facebook',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

authRegistry.registerPath({
  method: 'get',
  path: '/facebook/callback',
  tags: ['Auth'],
  security: [{ bearerauth: [] }],
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get(
  '/facebook/callback',
  (req, res, next) => {
    passport.authenticate('facebook', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/signin-success/${req.user?.id}`);
  }
);

authRegistry.registerPath({
  method: 'get',
  path: '/signin-success/{userId}',
  tags: ['Auth'],
  request: {
    params: z.object({
      userId: z.string(),
    }),
  },
  responses: createApiResponse(UserSchema, 'Success'),
});

router.get('/signin-success/:userId', controller.googleLoginSuccess);

export default router;
