import express from 'express';
import roomController from './room.controller';
const RoomRouter = express.Router();

RoomRouter.route('/board/:boardId').get(roomController.getAllYourRoomInBoard);
RoomRouter.route('/board/:boardId/generalRoom').get(roomController.getGeneralRoomInBoard);
RoomRouter.route('/board/:boardId/search').get(roomController.searchRoom);
RoomRouter.route('/board/:boardId/member').post(roomController.addMember).delete(roomController.removeMember);
RoomRouter.route('/:roomId').get(roomController.getOne);

export default RoomRouter;
