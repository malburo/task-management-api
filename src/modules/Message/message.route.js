import express from 'express';
import messageController from './message.controller';
const MessageRouter = express.Router();

MessageRouter.route('/').post(messageController.create);
MessageRouter.route('/rooms/:roomId').get(messageController.getAll);

export default MessageRouter;
