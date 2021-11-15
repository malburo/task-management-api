import { Router } from 'express';
import userController from './user.controller';
const UserRouter = Router();

UserRouter.route('/').get(userController.getAll);
UserRouter.route('/:userId').put(userController.updateInfo).delete(userController.deleteUser);
UserRouter.route('/:userId/change-password').put(userController.updatePassword);
export default UserRouter;
