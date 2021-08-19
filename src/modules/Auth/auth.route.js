import express from 'express';
import checkToken from 'middlewares/token.middleware';
import authController from './auth.controller';
import passport from 'passport';
const AuthRouter = express.Router();
AuthRouter.route('/test').get(function () {
  console.log(1);
});
AuthRouter.route('/getMe').get(checkToken, authController.getMe);
AuthRouter.route('/login').post(authController.login);
AuthRouter.route('/register').post(authController.register);
AuthRouter.route('/github').get(passport.authenticate('github'));
AuthRouter.route('/github/callback').get(
  passport.authenticate('github', { assignProperty: 'federatedUser', failureRedirect: '/login' }),
  authController.loginWithGithub
);
AuthRouter.route('/logout').get(authController.logout);
export default AuthRouter;
