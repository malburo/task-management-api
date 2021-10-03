import Result from 'helpers/result.helper';
import Message from './message.model';
import messageService from './message.service';

const getAllInRoom = async (req, res, next) => {
  try {
    const roomId = req.params;
    const messages = await messageService.getAllInRoom(roomId);
    const rs = messages.map((i) => {
      if (i.userId.equals(req.user._id)) i.isMe = true;
      else i.isMe = false;
      return i;
    });
    rs.sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
    Result.success(res, { rs });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    console.log(req.body);
    const { messageId } = req.params;
    const msgContent = req.body.data;
    const updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content: msgContent } }, { new: true });
    return Result.success(res, { updatedMessage });
  } catch (err) {
    next(err);
  }
};

const messageController = {
  getAllInRoom,
  update,
};

export default messageController;
