import Column from 'modules/Column/column.model';
import Label from 'modules/Label/label.model';
import Member from 'modules/Member/member.model';
import { Types } from 'mongoose';
import Board from './board.model';

const getAll = async ({ page = 1, limit = 8, q = '' }) => {
  try {
    const boards = await Board.aggregate([
      { $match: { isPrivate: false } },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },

      { $lookup: { from: 'members', localField: '_id', foreignField: 'boardId', as: 'members' } },
      { $lookup: { from: 'users', localField: 'members.userId', foreignField: '_id', as: 'members.data' } },
      { $addFields: { members: '$members.data' } },
      { $unset: 'members.password' },
    ]);
    const total = await Board.find({}).countDocuments();
    return { boards, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const getMyBoards = async ({ page = 1, limit = 8, q = '' }, ownerId) => {
  try {
    const members = await Member.find({ userId: ownerId, role: 'OWNER' }).lean();
    const boardIds = members.map((item) => Types.ObjectId(item.boardId));
    const boards = await Board.aggregate([
      { $match: { _id: { $in: boardIds } } },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },

      { $lookup: { from: 'members', localField: '_id', foreignField: 'boardId', as: 'members' } },
      { $lookup: { from: 'users', localField: 'members.userId', foreignField: '_id', as: 'members.data' } },
      { $addFields: { members: '$members.data' } },
      { $unset: 'members.password' },
    ]);
    return { boards, pagination: { page, limit, total: boardIds.length } };
  } catch (error) {
    throw error;
  }
};
const getMyBoardsJoined = async ({ page = 1, limit = 8, q = '' }, ownerId) => {
  try {
    const members = await Member.find({ userId: ownerId, role: 'MEMBER' }).lean();
    const boardIds = members.map((item) => Types.ObjectId(item.boardId));
    const boards = await Board.aggregate([
      { $match: { _id: { $in: boardIds } } },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },

      { $lookup: { from: 'members', localField: '_id', foreignField: 'boardId', as: 'members' } },
      { $lookup: { from: 'users', localField: 'members.userId', foreignField: '_id', as: 'members.data' } },
      { $addFields: { members: '$members.data' } },
      { $unset: 'members.password' },
    ]);
    const total = await Board.find({}).countDocuments();
    return { boards, pagination: { page, limit, total: boardIds.length } };
  } catch (error) {
    throw error;
  }
};
const getOne = async (boardId) => {
  try {
    const [board, columns, members, labels] = await Promise.all([
      Board.findById(boardId).lean(),
      Column.find({ boardId }).populate('tasks').lean(),
      Member.aggregate([
        { $match: { boardId: Types.ObjectId(boardId) } },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'data' } },
        { $addFields: { 'data.role': '$role' } },
        { $unwind: '$data' },
        { $replaceRoot: { newRoot: '$data' } },
        { $unset: 'password' },
      ]),
      Label.find({ boardId }).lean(),
    ]);
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

const removeColumnOrder = async (boardId, columnId) => {
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { _id: boardId },
      { $pull: { columnOrder: columnId } },
      { new: true }
    ).lean();
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const boardService = {
  getAll,
  getMyBoards,
  getMyBoardsJoined,
  getOne,
  create,
  update,
  pushColumnOrder,
  removeColumnOrder,
};
export default boardService;
