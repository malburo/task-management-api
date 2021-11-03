import Result from 'helpers/result.helper';
import memberService from 'modules/Member/member.service';
import roomService from 'modules/Room/room.service';
import boardService from './board.service';

const getAll = async (req, res, next) => {
  try {
    const { boards, pagination } = await boardService.getAll(req.query);
    Result.success(res, { boards, pagination });
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const fullBoard = await boardService.getOne(boardId);
    Result.success(res, fullBoard);
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newBoard = await boardService.create(req.body);
    const owner = await memberService.create({ userId: req.user._id, boardId: newBoard._id, role: 'OWNER' });
    await roomService.createBaseRoomForBoard({ userId: req.user._id, boardId: newBoard._id });
    Result.success(res, { newBoard, owner });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { io } = req.app;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;
    if (updateData.columns) delete updateData.columns;
    const updatedBoard = await boardService.update(boardId, updateData);
    io.sockets.in(boardId).emit('board:update', updatedBoard);
    Result.success(res, { updatedBoard });
  } catch (error) {
    return next(error);
  }
};

const boardController = { getAll, getOne, create, update };
export default boardController;
