import upload from 'config/multer.config';
import express from 'express';
import messageController from './message.controller';
const MessageRouter = express.Router();

MessageRouter.route('/').post(messageController.create);
MessageRouter.route('/image/:roomId').post(upload.single('file'), messageController.postImage);
MessageRouter.route('/form/select/:roomId').post(messageController.createSelectFormMessage);
MessageRouter.route('/form/select/:roomId/option')
  .post(messageController.addNewOptionToMessage)
  .put(messageController.editSelectFormMessage);
MessageRouter.route('/room/:roomId/:seed').get(messageController.getAllInRoom);
MessageRouter.route('/room/:roomId').patch(messageController.read);
MessageRouter.route('/:messageId').put(messageController.update).delete(messageController.deleteOne);

export default MessageRouter;
