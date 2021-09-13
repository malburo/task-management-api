import Result from 'helpers/result.helper';
import Board from './board.model';

const getAll = async (req, res, next) => {
  try {
    const boards = await Board.find({}).lean();
    Result.success(res, { boards });
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    // req.app.io.emit('hello', 'world');
    const board = await Board.findById(boardId)
      .populate({
        path: 'columns',
        populate: { path: 'tasks' },
      })
      .lean();

    Result.success(res, { board });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newBoard = await Board.create({
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

    const updatedBoard = await Board.findByIdAndUpdate(boardId, { $set: updateData }).lean();
    Result.success(res, { updatedBoard });
  } catch (error) {
    return next(error);
  }
};

const boardController = { getAll, getOne, create, update };
export default boardController;
