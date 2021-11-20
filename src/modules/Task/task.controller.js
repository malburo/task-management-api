import Result from 'helpers/result.helper';
import activityService from 'modules/Activity/activity.service';
import columnService from 'modules/Column/column.service';
import notificationService from 'modules/Notification/notification.service';
import userService from 'modules/User/user.service';
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
    const currentUser = req.user;
    delete currentUser.password;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;

    const updatedTask = await taskService.update(taskId, updateData);

    if (updateData.deadlineDay) {
      const newActivity = await activityService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
          deadlineDay: updatedTask.deadlineDay,
        },
        senderId: currentUser._id,
        type: 'TASK:ASSIGN_DEADLINE',
        boardId,
      });
      newActivity.senderId = currentUser;
      io.sockets.in(boardId).emit('activity:create', newActivity);
    }
    if (updateData.status === 'FINISHED') {
      const newActivity = await activityService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
        },
        senderId: currentUser._id,
        type: 'TASK:FINISHED_DEADLINE',
        boardId,
      });
      newActivity.senderId = currentUser;
      io.sockets.in(boardId).emit('activity:create', newActivity);
    }
    if (updateData.status === 'UNFINISHED' && !updateData.deadlineDay) {
      const newActivity = await activityService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
        },
        senderId: currentUser._id,
        type: 'TASK:UNFINISHED_DEADLINE',
        boardId,
      });
      newActivity.senderId = currentUser;
      io.sockets.in(boardId).emit('activity:create', newActivity);
    }
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
    const currentUser = req.user;
    delete currentUser.password;

    const updatedTask = await taskService.pushMember(taskId, memberId);
    const memberInfo = await userService.getOne({ userId: memberId });
    const newActivity = await activityService.create({
      content: {
        receiver: { username: memberInfo.username },
        task: { _id: taskId, title: updatedTask.title },
      },
      senderId: currentUser._id,
      type: 'TASK:ASSIGN_MEMBER',
      boardId,
    });
    newActivity.senderId = currentUser;
    if (currentUser._id !== memberId) {
      const newNotification = await notificationService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
        },
        senderId: currentUser._id,
        receiverId: memberId,
        type: 'TASK:ASSIGN_MEMBER',
        boardId,
      });
      newNotification.senderId = currentUser;
      io.sockets.in(memberId).emit('notification:create', newNotification);
    }

    io.sockets.in(boardId).emit('task:update', updatedTask);
    io.sockets.in(boardId).emit('activity:create', newActivity);

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
    const currentUser = req.user;
    delete currentUser.password;

    const updatedTask = await taskService.pullMember(taskId, memberId);
    const memberInfo = await userService.getOne({ userId: memberId });
    const newActivity = await activityService.create({
      content: {
        receiver: { username: memberInfo.username },
        task: { _id: taskId, title: updatedTask.title },
      },
      senderId: currentUser._id,
      type: 'TASK:REASSIGN_MEMBER',
      boardId,
    });
    newActivity.senderId = currentUser;

    if (currentUser._id !== memberId) {
      const newNotification = await notificationService.create({
        content: {
          task: { _id: taskId, title: updatedTask.title },
        },
        senderId: currentUser._id,
        receiverId: memberId,
        type: 'TASK:REASSIGN_MEMBER',
        boardId,
      });
      newNotification.senderId = currentUser;
      io.sockets.in(memberId).emit('notification:create', newNotification);
    }

    io.sockets.in(boardId).emit('activity:create', newActivity);
    io.sockets.in(boardId).emit('task:update', updatedTask);
    Result.success(res, { updatedTask });
  } catch (error) {
    return next(error);
  }
};

const taskController = { create, update, pushLabel, pullLabel, pushMember, pullMember };
export default taskController;
