import express from 'express';
import columnController from './column.controller';
const ColumnRouter = express.Router();

ColumnRouter.route('/').post(columnController.create);
ColumnRouter.route('/:columnId').put(columnController.update);

export default ColumnRouter;
