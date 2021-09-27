import express from 'express';
import roomController from './room.controller';
const RoomRouter = express.Router();

RoomRouter.route('/channel').post(roomController.create);
RoomRouter.route('/board/:boardId/member').post(roomController.addMember).delete(roomController.removeMember);
RoomRouter.route('/board/:boardId').get(roomController.getAllYourRoomInBoard);
RoomRouter.route('/:roomId').get(roomController.getOne);

export default RoomRouter;
