import express from 'express';
import messageController from './message.controller';
const MesssageRouter = express.Router();

MesssageRouter.route('/room/:roomId').get(messageController.getAllInRoom);

export default MesssageRouter;
