import Result from 'helpers/result.helper';
import Room from 'modules/Room/room.model';
import messageService from './message.service';

const create = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { roomId, content, type } = req.body;
    const currentUser = req.user;
    const message = await messageService.create({
      roomId,
      content,
      userId: currentUser._id,
      type,
    });
    const room = await Room.findById(roomId).lean();
    if (room.usersId.length === 0) {
      io.to(roomId).emit('messages:create', message);
      return Result.success(res, { message });
    }
    io.to(room.usersId.map((item) => item.toString())).emit('messages:create', message);
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    console.log(req.query);
    const { messages, pagination } = await messageService.getAll(req.query, roomId);
    Result.success(res, { messages, pagination });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const messageController = {
  create,
  getAll,
};

export default messageController;
