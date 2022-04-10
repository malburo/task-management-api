import Whiteboard from './whiteboard.model';
import { Types } from 'mongoose';

const getOne = async (whiteboardId) => {
  try {
    const whiteboard = await Whiteboard.findById(whiteboardId).lean();
    return { whiteboard };
  } catch (error) {
    throw error;
  }
};

const getAll = async ({ page = 1, limit = 8, q = '' }, boardId) => {
  try {
    const whiteboards = await Whiteboard.aggregate([
      { $match: { boardId: Types.ObjectId(boardId) } },
      { $sort: { createdAt: -1 } },
      { $skip: parseInt(page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ]);
    const total = await Whiteboard.find({}).countDocuments();
    return { whiteboards, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newWhiteboard = await Whiteboard.create(data);
    return newWhiteboard;
  } catch (error) {
    throw error;
  }
};

const update = async (whiteboardId, updateData) => {
  try {
    const updatedWhiteboard = await Whiteboard.findByIdAndUpdate(
      whiteboardId,
      { $set: updateData },
      { new: true }
    ).lean();
    return updatedWhiteboard;
  } catch (error) {
    throw error;
  }
};

const whiteboardService = { getOne, getAll, create, update };
export default whiteboardService;
