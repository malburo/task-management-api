import express from 'express';
import messageController from './message.controller';
import checkPermissionInRoom from '../../middlewares/room.middleware';
const MessageRouter = express.Router();

MessageRouter.route('/').post(messageController.create);
MessageRouter.route('/rooms/:roomId').get(checkPermissionInRoom, messageController.getAll);

export default MessageRouter;
