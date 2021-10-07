import express from 'express';
import messageController from './message.controller';
const MesssageRouter = express.Router();

MesssageRouter.route('/').post(messageController.create);
MesssageRouter.route('/room/:roomId/:seed').get(messageController.getAllInRoom);
MesssageRouter.route('/:messageId').put(messageController.update).delete(messageController.deleteOne);

export default MesssageRouter;
