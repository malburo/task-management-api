import express from 'express';
import commentController from './comment.controller';
const CommentRouter = express.Router({ mergeParams: true });

CommentRouter.route('/').post(commentController.create);
CommentRouter.route('/:commentId').put(commentController.update).delete(commentController.deleteOne);
CommentRouter.route('/tasks/:taskId').get(commentController.getByTaskId);

export default CommentRouter;
