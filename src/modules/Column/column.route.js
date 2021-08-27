import express from 'express';
import columnController from './column.controller';
const ColumnRouter = express.Router();

ColumnRouter.route('/').post(columnController.create);

export default ColumnRouter;
