import express from 'express';
import notificationController from './notification.controller';
const NotificationRouter = express.Router();

NotificationRouter.route('/').get(notificationController.getAll).post(notificationController.create);

export default NotificationRouter;
