import Result from 'helpers/result.helper';
import activityService from 'modules/Activity/activity.service';
import boardService from 'modules/Board/board.service';
import taskService from 'modules/Task/task.service';
import columnService from './column.service';

const create = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { boardId } = req.body;
    const newColumn = await columnService.create(req.body);
    const updatedBoard = await boardService.pushColumnOrder(boardId, newColumn._id);
    io.sockets.in(boardId).emit('column:create', { newColumn, newColumnOrder: updatedBoard.columnOrder });
    Result.success(res, { newColumn });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const { io } = req.app;
    const updateData = { ...req.body, updateAt: Date.now() };
    const { taskId } = updateData;
    const currentUser = req.user;
    delete currentUser.password;

    if (updateData._id) delete updateData._id;
    if (updateData.tasks) delete updateData.tasks;

    const updatedColumn = await columnService.update(columnId, updateData);
    io.sockets.in(updatedColumn.boardId.toString()).emit('column:update', updatedColumn);

    if (taskId) {
      const updatedTask = await taskService.update(taskId, { columnId });
      const newActivity = await activityService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
          column: { _id: columnId, title: updatedColumn.title },
        },
        senderId: currentUser._id,
        type: 'TASK:DRAG_DROP',
        boardId: updatedColumn.boardId,
      });
      newActivity.senderId = currentUser;
      io.sockets.in(updatedColumn.boardId.toString()).emit('activity:create', newActivity);
      io.sockets.in(updatedColumn.boardId.toString()).emit('task:update', updatedTask);
    }

    Result.success(res, { updatedColumn });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
const deleteOne = async (req, res, next) => {
  try {
    const { columnId } = req.params;
    const { io } = req.app;
    const deletedColumn = await columnService.deleteOne(columnId);
    const deletedTasksInColumn = await taskService.deleteByColumnId(columnId);
    await boardService.removeColumnOrder(deletedColumn.boardId, columnId);
    io.sockets.in(deletedColumn.boardId.toString()).emit('column:delete', deletedColumn);
    Result.success(res, { deletedColumn });
  } catch (error) {
    return next(error);
  }
};

const columnController = { create, update, deleteOne };
export default columnController;
