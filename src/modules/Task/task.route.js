import express from 'express';
import taskController from './task.controller';
const TaskRouter = express.Router({ mergeParams: true });

TaskRouter.route('/').post(taskController.create);
TaskRouter.route('/:taskId').put(taskController.update);
TaskRouter.route('/:taskId/labels').post(taskController.pushLabel).delete(taskController.pullLabel);
TaskRouter.route('/:taskId/members').post(taskController.pushMember).delete(taskController.pullMember);
export default TaskRouter;
