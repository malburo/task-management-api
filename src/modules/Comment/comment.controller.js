import Result from 'helpers/result.helper';
import commentService from './comment.service';

const getByTaskId = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const comments = await commentService.getByTaskId(taskId);
    Result.success(res, { comments });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { taskId, content } = req.body;
    const userId = req.user._id;

    const createdComment = await commentService.create({ content, taskId, userId });
    const newComment = await commentService.getOne(createdComment._id);
    io.sockets.in(taskId).emit('comment:create', newComment);
    Result.success(res, { newComment });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { commentId } = req.params;
    const { taskId } = req.body;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;
    if (updateData.taskId) delete updateData.taskId;

    const comment = await commentService.update(commentId, updateData);
    const updatedComment = await commentService.getOne(comment._id);
    io.sockets.in(taskId).emit('comment:update', updatedComment);
    Result.success(res, { updatedComment });
  } catch (error) {
    return next(error);
  }
};
const deleteOne = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { taskId } = req.body;
    const { io } = req.app;
    const deletedComment = await commentService.deleteOne(commentId);
    io.sockets.in(taskId).emit('comment:delete', deletedComment);
    Result.success(res, { deletedComment });
  } catch (error) {
    return next(error);
  }
};

const commentController = { getByTaskId, create, update, deleteOne };
export default commentController;
