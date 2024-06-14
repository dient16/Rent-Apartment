import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

import * as controller from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation';
import { verifyAccessToken } from '../middlewares/verifyToken';
import { userLoginSchema, userSignUpSchema } from '../utils/validation';

const router = Router();

router.post('/register', validateRequest(userSignUpSchema), controller.register);
router.post('/login', validateRequest(userLoginSchema), controller.login);
router.get('/logout', verifyAccessToken, controller.logout);
router.post('/refresh-token', verifyAccessToken, controller.refreshAccessToken);
router.get('/confirm-email', controller.confirmEmail);
router.post('/set-password', controller.setPassword);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get(
  '/google/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req: Request, res: Response) => {
    res.redirect(`${process.env.CLIENT_URL}/signin-success/${req.user?._id}`);
  }
);

router.get('/facebook', passport.authenticate('facebook', { session: false, scope: ['email'] }));

router.get(
  '/facebook/callback',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', (err, profile) => {
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req: Request, res: Response) => {
    res.redirect(`${process.env.CLIENT_URL}/signin-success/${req.user?.id}`);
  }
);

router.get('/signin-success/:userId', controller.googleLoginSuccess);

export default router;
