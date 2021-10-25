import express from 'express';
import checkToken from 'middlewares/token.middleware';
import authController from './auth.controller';
import passport from 'passport';
import { loginSchema, registerSchema } from './auth.validate';
import { celebrate } from 'celebrate';

const AuthRouter = express.Router();
AuthRouter.route('/getMe').get(checkToken, authController.getMe);
AuthRouter.route('/login').post(celebrate(loginSchema), authController.login);
AuthRouter.route('/register').post(celebrate(registerSchema), authController.register);
AuthRouter.route('/github').get(passport.authenticate('github'));
AuthRouter.route('/github/callback').get(
  passport.authenticate('github', { assignProperty: 'federatedUser', failureRedirect: '/login' }),
  authController.loginWithGithub
);
export default AuthRouter;
