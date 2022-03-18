import express from 'express';
import roomController from './room.controller';
const RoomRouter = express.Router();

RoomRouter.route('/').get(roomController.getAllRoom);
RoomRouter.route('/:roomId').get(roomController.getOne);
RoomRouter.route('/members/:memberId').get(roomController.getOneByMemberId);

export default RoomRouter;
