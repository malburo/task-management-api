import Result from 'helpers/result.helper';
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
    const newBoard = await boardService.create({
      ...req.body,
      adminId: req.user._id,
    });
    Result.success(res, { newBoard });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;
    if (updateData.columns) delete updateData.columns;
    const updatedBoard = await boardService.update(boardId, updateData);
    Result.success(res, { updatedBoard });
  } catch (error) {
    return next(error);
  }
};

const boardController = { getAll, getOne, create, update };
export default boardController;
