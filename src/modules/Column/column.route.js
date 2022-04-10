import express from 'express';
import columnController from './column.controller';
const ColumnRouter = express.Router();

ColumnRouter.route('/').post(columnController.create);
ColumnRouter.route('/:columnId').put(columnController.update).delete(columnController.deleteOne);
ColumnRouter.route('/:columnId/workflow').post(columnController.pushWorkflow).delete(columnController.pullWorkflow);

export default ColumnRouter;
