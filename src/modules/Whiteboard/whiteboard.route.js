import express from 'express';
import whiteboardController from './whiteboard.controller';
const WhiteboardRouter = express.Router({ mergeParams: true });

WhiteboardRouter.route('/').get(whiteboardController.getAll).post(whiteboardController.create);
WhiteboardRouter.route('/:whiteboardId').get(whiteboardController.getOne).put(whiteboardController.update);

export default WhiteboardRouter;
