import { Types } from 'mongoose';
import Comment from './comment.model';

const getByTaskId = async (taskId) => {
  try {
    const comments = await Comment.aggregate([
      { $match: { taskId: Types.ObjectId(taskId) } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'member' } },
      { $unwind: '$member' },
      { $unset: 'member.password' },
      { $sort: { createdAt: -1 } },
    ]);
    return comments;
  } catch (error) {
    throw error;
  }
};
const getOne = async (commentId) => {
  try {
    const comments = await Comment.aggregate([
      { $match: { _id: Types.ObjectId(commentId) } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'member' } },
      { $unwind: '$member' },
      { $unset: 'member.password' },
    ]);
    return comments[0];
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newComment = await Comment.create(data);
    return newComment;
  } catch (error) {
    throw error;
  }
};

const update = async (commentId, data) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: data }, { new: true }).lean();
    return updatedComment;
  } catch (error) {
    throw error;
  }
};
const deleteOne = async (commentId) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId).lean();
    return deletedComment;
  } catch (error) {
    throw error;
  }
};
const commentService = { getByTaskId, getOne, create, update, deleteOne };
export default commentService;
