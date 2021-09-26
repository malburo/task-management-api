import express from "express";
import roomController from "./room.controller";
const RoomRouter = express.Router();

RoomRouter.route('/board/:boardId').get(roomController.getAllRoomInBoard);
RoomRouter.route('/:roomId').get(roomController.getOne);
RoomRouter.route('/member').post(roomController.addMember).delete(roomController.removeMember)

export default RoomRouter;