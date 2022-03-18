import Result from 'helpers/result.helper';
import Room from './room.model';
import roomService from './room.service';

const getOneByMemberId = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { boardId } = req.query;
    const currentUser = req.user;

    let room = await Room.findOne({
      $or: [
        { boardId, usersId: [currentUser._id, memberId] },
        { boardId, usersId: [memberId, currentUser._id] },
      ],
    })
      .populate({
        path: 'message',
        populate: {
          path: 'user',
        },
      })
      .lean();
    if (!room) {
      room = await Room.create({ boardId, usersId: [currentUser._id, memberId], type: 'DIRECT' });
      room.message = [];
    }

    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    let room = await Room.findById(roomId).populate('members').lean();
    if (!room.name || room.name === '') {
      const user = room.members.find((user) => user._id.toString() !== req.user._id.toString());
      if (!user) room.name = req.user.username;
      else room.name = user.username;
    }
    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const getAllRoom = async (req, res, next) => {
  try {
    const { boardId } = req.query;
    const rooms = await Room.find({ boardId });
    Result.success(res, { rooms });
  } catch (error) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const newRoom = await roomService.create(req.body);
    Result.success(res, { newRoom });
  } catch (error) {
    return next(error);
  }
};

const roomController = {
  getOneByMemberId,
  getOne,
  getAllRoom,
  create,
};

export default roomController;
