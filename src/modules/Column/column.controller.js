import Result from 'helpers/result.helper';
import Board from 'modules/Board/board.model';
import Column from './column.model';

const create = async (req, res, next) => {
  try {
    const { title, boardId } = req.body;
    const newColumn = await Column.create({
      title,
      boardId,
    });
    await Board.findOneAndUpdate({ _id: boardId }, { $push: { columnOrder: newColumn._id } });
    Result.success(res, { newColumn });
  } catch (error) {
    return next(error);
  }
};

const columnController = { create };
export default columnController;
