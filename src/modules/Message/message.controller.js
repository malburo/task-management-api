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
      readBy: [currentUser._id],
    });
    const [room] = await Promise.all([Room.findById(roomId).lean(), messageService.pushReadBy(roomId, req.user._id)]);

    io.to(room.boardId.toString()).emit('rooms:update', room);
    io.to(roomId).emit('messages:create', message);
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await messageService.pushReadBy(roomId, req.user._id);
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
