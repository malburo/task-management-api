import Room from './room.model';

const getOneByMemberId = async (data) => {
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

const roomService = {
  getOneByMemberId,
  create,
};

export default roomService;
