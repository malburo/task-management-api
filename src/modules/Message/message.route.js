import upload from 'config/multer.config';
import express from 'express';
import uploadMiddleware from 'middlewares/upload.middleware';
import messageController from './message.controller';
const MessageRouter = express.Router();

MessageRouter.route('/').post(messageController.create);
MessageRouter.route('/image/:roomId').post(upload.single('file'), uploadMiddleware, messageController.postImage);
MessageRouter.route('/room/:roomId/:seed').get(messageController.getAllInRoom);
MessageRouter.route('/room/:roomId').patch(messageController.read);
MessageRouter.route('/:messageId').put(messageController.update).delete(messageController.deleteOne);

export default MessageRouter;
