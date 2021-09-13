import express from 'express';
import taskController from './task.controller';
const TaskRouter = express.Router();

TaskRouter.route('/').post(taskController.create);
TaskRouter.route('/:taskId').put(taskController.update);

export default TaskRouter;
