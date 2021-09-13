import Result from 'helpers/result.helper';
import Column from 'modules/Column/column.model';
import Task from './task.model';

const create = async (req, res, next) => {
  try {
    const { content, columnId } = req.body;
    const newTask = await Task.create({
      content,
      columnId,
    });
    await Column.findOneAndUpdate({ _id: columnId }, { $push: { taskOrder: newTask._id } });
    Result.success(res, { newTask });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;

    const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updateData }).lean();
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const taskController = { create, update };
export default taskController;
