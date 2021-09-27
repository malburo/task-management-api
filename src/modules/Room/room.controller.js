import Result from 'helpers/result.helper';
import Room from './room.model';
import roomService from './room.service';
import User from '../User/user.model';

const getAllYourRoomInBoard = async (req, res, next) => {
  try {
    const boardId = req.params;
    let rooms = await roomService.getAllRoomInBoard(boardId);
    rooms = rooms.filter((r) => r.userId.some((i) => i.toString() == req.user._id));
    rooms = rooms.map((i) => {
      if (i.isGeneral) i.name = i.board.title;
      else i.name = i.members.filter((m) => m._id.toString() != req.user._id.toString())[0].fullname;
      return i;
    });
    Result.success(res, { rooms });
  } catch (err) {
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
    await Room.findOneAndUpdate({ _id: generalRoom._id }, generalRoom);

    const rs = await Room.deleteMany({ isGeneral: false, boardId, userId });
    Result.success(res, { rs });
  } catch (err) {
    next(err);
  }
};

const roomController = {
  getAllYourRoomInBoard,
  getOne,
  create,
  addMember,
  removeMember,
};

export default roomController;
