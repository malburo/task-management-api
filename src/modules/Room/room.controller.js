import Result from 'helpers/result.helper';
import Room from './room.model';
import roomService from './room.service';
import User from '../User/user.model';
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

const searchChannel = async (req, res, next) => {
  try {
    const { term } = req.query;
    const generalRooms = await Room.find({ isGeneral: true, userId: req.user._id }).populate('board').lean();
    const allChannels = generalRooms.map((i) => i.board);
    const channels = allChannels.filter((i) => i.title.match(new RegExp(term, 'i')));
    Result.success(res, { channels });
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

const create = async (req, res, next) => {
  try {
    const data = { ...req.body };
    data.userId = [req.user._id];
    data.isGeneral = true;
    const newRoom = await roomService.create(data);
    Result.success(res, { newRoom });
  } catch (err) {
    next(err);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;
    const generalRoom = await Room.findOne({ boardId, isGeneral: true }).lean();
    if (generalRoom == null) {
      return Result.error(res, 'Kênh không tồn tại');
    }
    const newMember = await User.findById(userId);
    if (newMember == null) {
      return Result.error(res, 'User không tồn tại');
    }
    if (generalRoom.userId.some((i) => i.toString() == userId)) {
      return Result.error(res, 'User đã tồn tại trong kênh chat');
    }

    generalRoom.userId.forEach((i) => {
      let data = { boardId, userId: [newMember._id, i], isGeneral: false };
      roomService.create(data);
    });

    generalRoom.userId.push(userId);

    let updatedRoom = await Room.findOneAndUpdate({ _id: generalRoom._id }, generalRoom, { new: true });

    Result.success(res, updatedRoom);
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;
    const generalRoom = await Room.findOne({ boardId, isGeneral: true }).lean();
    if (generalRoom == null) {
      return Result.error(res, 'Kênh không tồn tại');
    }
    const newMember = await User.findById(userId);
    if (newMember == null) {
      return Result.error(res, 'User không tồn tại');
    }
    if (!generalRoom.userId.some((i) => i.toString() == userId)) {
      return Result.error(res, 'User không tồn tại trong kênh chat');
    }
    generalRoom.userId = generalRoom.userId.filter((item) => item.toString() != userId);

    const rs = await Room.findOneAndUpdate({ _id: generalRoom._id }, generalRoom, { new: true });

    await Room.deleteMany({ isGeneral: false, boardId, userId });

    Result.success(res, { rs });
  } catch (err) {
    next(err);
  }
};

const roomController = {
  getAllYourChannel,
  getAllYourRoomInBoard,
  getOne,
  create,
  addMember,
  removeMember,
  searchChannel,
};

export default roomController;
