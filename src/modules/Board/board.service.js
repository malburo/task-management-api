import Column from 'modules/Column/column.model';
import Label from 'modules/Label/label.model';
import Member from 'modules/Member/member.model';
import { Types } from 'mongoose';
import Board from './board.model';

const getAll = async ({ page = 1, limit = 8, q = '' }) => {
  try {
    const boards = await Board.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },

      { $lookup: { from: 'members', localField: '_id', foreignField: 'boardId', as: 'members' } },
      { $lookup: { from: 'users', localField: 'members.userId', foreignField: '_id', as: 'members.data' } },
      { $addFields: { members: '$members.data' } },
    ]);
    const total = await Board.find({}).countDocuments();
    return { boards, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const getOne = async (boardId) => {
  try {
    const board = await Board.findById(boardId).lean();
    const columns = await Column.find({ boardId }).populate('tasks').lean();
    const members = await Member.aggregate([
      { $match: { boardId: Types.ObjectId(boardId) } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'data' } },
      { $unwind: '$data' },
      { $replaceRoot: { newRoot: '$data' } },
    ]);
    const labels = await Label.find({ boardId }).lean();
    return { board, columns, members, labels };
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newBoard = await Board.create(data);
    return newBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, data) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(boardId, { $set: data }, { new: true }).lean();
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const pushColumnOrder = async (boardId, columnId) => {
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { columnOrder: columnId } },
      { new: true }
    ).lean();
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};
const boardService = { getAll, getOne, create, update, pushColumnOrder };
export default boardService;
