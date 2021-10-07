import Result from 'helpers/result.helper';
import io from 'server';
import messageService from './message.service';

const getAllInRoom = async (req, res, next) => {
  try {
    const { roomId, seed } = req.params;
    const limit = 20 * (seed + 1);
    const skip = 20 * seed;
    const messages = await messageService.getAllInRoom({ roomId, limit, skip });
    Result.success(res, { messages });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { msgContent, roomId } = req.body.data;
    const updatedMessage = await messageService.updateOne({ messageId, msgContent, roomId });
    io.sockets.in(updatedMessage.roomId.toString()).emit('chat:edit-message', { message: updatedMessage });
    return Result.success(res, { updatedMessage });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await messageService.deleteOne({ _id: messageId });
    io.sockets.in(message.roomId.toString()).emit('chat:delete-message', { message });
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { roomId, content } = req.body;
    const message = await messageService.create({ roomId, content, userId: req.user._id });
    io.sockets.in(message.roomId.toString()).emit('chat:add-message', { message });
    return Result.success(res, { message });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const messageController = {
  getAllInRoom,
  create,
  update,
  deleteOne,
};

export default messageController;
