import express from 'express';
import historyController from 'modules/Activity/activity.controller';
import boardController from './board.controller';
const BoardRouter = express.Router();

BoardRouter.route('/').get(boardController.getAll).post(boardController.create);
BoardRouter.route('/myBoard/owner').get(boardController.getMyBoards);
BoardRouter.route('/myBoard/joined').get(boardController.getMyBoardsJoined);
BoardRouter.route('/:boardId').get(boardController.getOne).put(boardController.update);
BoardRouter.route('/:boardId/activities').get(historyController.getActivityByBoardId);
BoardRouter.route('/:boardId/activities/members/:memberId').get(historyController.getActivityByMemberId);

export default BoardRouter;
