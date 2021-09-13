import Result from 'helpers/result.helper';
import Board from 'modules/Board/board.model';
import Task from 'modules/Task/task.model';
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

const update = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;
    if (updateData.tasks) delete updateData.tasks;
    if (updateData.taskId) {
      await Task.findByIdAndUpdate(updateData.taskId, { $set: { columnId } }).lean();
      delete updateData.taskId;
    }
    const updatedColumn = await Column.findByIdAndUpdate(columnId, { $set: updateData }).lean();
    Result.success(res, { updatedColumn });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const columnController = { create, update };
export default columnController;
