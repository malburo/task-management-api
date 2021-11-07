import User from 'modules/User/user.model';
import Room from './room.model';

const getAllRoomInBoard = async (data) => {
  try {
    const rooms = await Room.find({ boardId: data.boardId }).populate('board').populate('members').lean();
    return rooms;
  } catch (err) {
    throw err;
  }
};

const getOne = async (data) => {
  try {
    const room = await Room.findOne({ _id: data.roomId }).populate('board').populate('members').lean();
    return room;
  } catch (err) {
    throw err;
  }
};

const create = async (data) => {
  try {
    const newRoom = await Room.create(data);
    return newRoom;
  } catch (err) {
    throw err;
  }
};

const removeMember = async (data) => {
  try {
    const { boardId, userId } = data;
    const generalRoom = await Room.findOne({ boardId, isGeneral: true }).lean();
    if (generalRoom == null) {
      throw Error('Message room not exist');
    }
    const newMember = await User.findById(userId);
    if (newMember == null) {
      throw Error('User not found');
    }
    if (!generalRoom.userId.some((i) => i.toString() == userId)) {
      throw Error('User not exist in project');
    }

    const room = await Room.findByIdAndUpdate(generalRoom._id, { $pull: { userId: userId } }, { new: true });

    await Room.deleteMany({ isGeneral: false, boardId, userId });

    return room;
  } catch (error) {
    throw error;
  }
};

const addMember = async (data) => {
  try {
    const { boardId, userId } = data;
    const generalRoom = await Room.findOne({ boardId, isGeneral: true }).lean();
    if (generalRoom == null) {
      throw Error('Room not exist');
    }
    const newMember = await User.findById(userId);
    if (newMember == null) {
      throw Error('User not found');
    }
    if (generalRoom.userId.some((i) => i.toString() == userId)) {
      throw Error('Already exist');
    }

    generalRoom.userId.forEach((i) => {
      let data = { boardId, userId: [newMember._id, i], isGeneral: false };
      roomService.create(data);
    });

    let room = await Room.findByIdAndUpdate(generalRoom._id, { $addToSet: { userId: userId } }, { new: true });

    return room;
  } catch (err) {
    throw err;
  }
};

const createBaseRoomForBoard = async (data) => {
  try {
    const { userId, boardId } = data;
    const newRoom = await Room.create({ boardId, userId: [userId], isGeneral: true });
    return newRoom;
  } catch (err) {
    throw Error('Failed to create base room');
  }
};
const roomService = {
  getAllRoomInBoard,
  getOne,
  create,
  removeMember,
  addMember,
  createBaseRoomForBoard,
};

export default roomService;
