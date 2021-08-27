import Result from 'helpers/result.helper';
import Board from './board.model';

const getAll = async (req, res, next) => {
  try {
    const boards = await Board.find({});
    Result.success(res, { boards });
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate({
      path: 'columns',
      populate: { path: 'tasks' },
    });
    Result.success(res, { board });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { isPrivate, title, description, coverUrl } = req.body;
    const newBoard = await Board.create({
      isPrivate,
      title,
      description,
      coverUrl,
      adminId: req.user._id,
    });
    Result.success(res, { newBoard: newBoard });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const boardController = { getAll, getOne, create };
export default boardController;
