import Result from 'helpers/result.helper';
import columnService from 'modules/Column/column.service';
import Task from './task.model';
import taskService from './task.service';

const create = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { io } = req.app;
    const newTask = await taskService.create(req.body);
    const updatedColumn = await columnService.pushTaskOrder(req.body.columnId, newTask._id);
    io.sockets.in(boardId).emit('task:create', { newTask, newTaskOrder: updatedColumn.taskOrder });
    Result.success(res, { newTask });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { taskId, boardId } = req.params;
    const { io } = req.app;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;

    const updatedTask = await taskService.update(taskId, updateData);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const pushLabel = async (req, res, next) => {
  try {
    const { boardId, taskId } = req.params;
    const { labelId } = req.body;
    const { io } = req.app;

    const updatedTask = await taskService.pushLabel(taskId, labelId);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const pullLabel = async (req, res, next) => {
  try {
    const { boardId, taskId } = req.params;
    const { labelId } = req.body;
    const { io } = req.app;

    const updatedTask = await taskService.pullLabel(taskId, labelId);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const pushMember = async (req, res, next) => {
  try {
    const { boardId, taskId } = req.params;
    const { memberId } = req.body;
    const { io } = req.app;

    const updatedTask = await taskService.pushMember(taskId, memberId);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const pullMember = async (req, res, next) => {
  try {
    const { boardId, taskId } = req.params;
    const { memberId } = req.body;
    const { io } = req.app;

    const updatedTask = await taskService.pullMember(taskId, memberId);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { newLabel });
  } catch (error) {
    return next(error);
  }
};

const taskController = { create, update, pushLabel, pullLabel, pushMember, pullMember };
export default taskController;
