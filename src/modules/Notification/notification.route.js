import express from 'express';
import notificationController from './notification.controller';
const NotificationRouter = express.Router();

NotificationRouter.route('/').get(notificationController.getAll).delete(notificationController.deleteAll);
NotificationRouter.route('/:notificationId').put(notificationController.update);
export default NotificationRouter;
