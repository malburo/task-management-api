import Result from 'helpers/result.helper';
import botService from 'modules/Bot/bot.service';
import Member from 'modules/Member/member.model';
import memberService from 'modules/Member/member.service';
import roomService from 'modules/Room/room.service';
import Board from './board.model';
import boardService from './board.service';

const getAll = async (req, res, next) => {
  try {
    const { boards, pagination } = await boardService.getAll(req.query);
    Result.success(res, { boards, pagination });
  } catch (error) {
    return next(error);
  }
};
const getMyBoards = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { boards, pagination } = await boardService.getMyBoards(req.query, userId);
    Result.success(res, { boards, pagination });
  } catch (error) {
    return next(error);
  }
};

const getMyBoardsJoined = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { boards, pagination } = await boardService.getMyBoardsJoined(req.query, userId);
    Result.success(res, { boards, pagination });
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;
    const board = await Board.findById(boardId).lean();
    if (board.isPrivate) {
      const members = await Member.countDocuments({ boardId, userId }).lean();
      if (!members) return Result.error(res, { message: 'Access denied' }, 401);
      const fullBoard = await boardService.getOne(boardId);
      Result.success(res, fullBoard);
      return;
    }
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
    await roomService.create({ boardId: newBoard._id, name: 'General', type: 'GROUP' });
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

const boardController = { getAll, getMyBoards, getMyBoardsJoined, getOne, create, update };
export default boardController;
