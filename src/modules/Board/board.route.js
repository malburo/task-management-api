import express from 'express';
import boardController from './board.controller';
const BoardRouter = express.Router();

BoardRouter.route('/').get(boardController.getAll).post(boardController.create);
BoardRouter.route('/:boardId').get(boardController.getOne);

export default BoardRouter;
