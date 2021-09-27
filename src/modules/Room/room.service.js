import Room from './room.model';

const getAllRoomInBoard = async (data) => {
  try {
    const rooms = await Room.find({ boardId: data.boardId }).populate('members').lean();
    return rooms;
  } catch (err) {
    throw err;
  }
};

const getOne = async (data) => {
  try {
    const room = await Room.find({ _id: data.roomId }).populate('members').populate('board').lean();
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

const roomService = {
  getAllRoomInBoard,
  getOne,
  create,
};

export default roomService;
