import Result from 'helpers/result.helper';
import Room from './room.model';
import roomService from './room.service';
import Message from 'modules/Message/message.model';

const getAllYourChannel = async (req, res, next) => {
  try {
    const generalRooms = await Room.find({ isGeneral: true, userId: req.user._id }).populate('board').lean();
    const channels = generalRooms.map((i) => i.board);
    Result.success(res, { channels });
  } catch (err) {
    next(err);
  }
};

const getGeneralRoomInBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    let room = await Room.findOne({ boardId, isGeneral: true }).populate('board').lean();
    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const getUserRoomInBoard = async (req, res, next) => {
  try {
    const { boardId, userId } = req.params;
    const room = await Room.findOne({ boardId, isGeneral: false, userId: [req.user._id, userId] }).lean();
    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const searchRoom = async (req, res, next) => {
  try {
    const { term } = req.query;
    const { boardId } = req.params;
    let rooms = await roomService.getAllRoomInBoard({ boardId });
    rooms = rooms.filter((r) => r.userId.some((i) => i.toString() == req.user._id));
    let message;
    let data;
    rooms = await Promise.all(
      rooms.map(async (i) => {
        if (i.isGeneral) i.name = i.board.title;
        else {
          data = i.members.filter((m) => m._id.toString() != req.user._id.toString())[0];
          i.name = data.fullname;
          i.image = data.profilePictureUrl;
        }
        message = await Message.find({ roomId: i._id, readBy: { $ne: req.user._id } }).lean();
        i.newMessage = message.length;
        return i;
      })
    );
    const searchRooms = rooms.filter((i) => i.name.match(new RegExp(term, 'i')));
    Result.success(res, { room: searchRooms });
  } catch (err) {
    next(err);
  }
};

const getAllYourRoomInBoard = async (req, res, next) => {
  try {
    const boardId = req.params;
    let rooms = await roomService.getAllRoomInBoard(boardId);
    rooms = rooms.filter((r) => r.userId.some((i) => i.toString() == req.user._id));
    let message;
    let data;
    rooms = await Promise.all(
      rooms.map(async (i) => {
        if (i.isGeneral) i.name = i.board.title;
        else {
          data = i.members.filter((m) => m._id.toString() != req.user._id.toString())[0];
          i.name = data.fullname;
          i.image = data.profilePictureUrl;
        }
        message = await Message.find({ roomId: i._id, readBy: { $ne: req.user._id } }).lean();
        i.newMessage = message.length;
        return i;
      })
    );
    Result.success(res, { rooms });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const roomId = req.params;
    const room = await roomService.getOne(roomId);
    if (room.isGeneral) room.name = room.board.title;
    else room.name = room.members.filter((m) => m._id.toString() != req.user._id.toString())[0].fullname;
    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;
    const room = await roomService.addMember({ boardId, userId });
    Result.success(res, room);
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;
    const room = await roomService.removeMember({ boardId, userId });
    Result.success(res, { room });
  } catch (err) {
    next(err);
  }
};

const roomController = {
  getAllYourChannel,
  getAllYourRoomInBoard,
  getOne,
  addMember,
  removeMember,
  getUserRoomInBoard,
  getGeneralRoomInBoard,
  searchRoom,
};

export default roomController;
