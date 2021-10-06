import Result from 'helpers/result.helper';
import columnService from 'modules/Column/column.service';
import Task from './task.model';
import taskService from './task.service';

const create = async (req, res, next) => {
  try {
    const { io } = req.app;
    const newTask = await taskService.create(req.body);
    const updatedColumn = await columnService.pushTaskOrder(req.body.columnId, newTask._id);
    io.sockets
      .in(updatedColumn.boardId.toString())
      .emit('task:create', { newTask, newTaskOrder: updatedColumn.taskOrder });
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
