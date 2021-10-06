import Result from 'helpers/result.helper';
import Message from './message.model';
import messageService from './message.service';

const getAllInRoom = async (req, res, next) => {
  try {
    const { roomId, seed } = req.params;
    const limit = 10 * (seed + 1);
    const skip = 10 * seed;
    const messages = await messageService.getAllInRoom({ roomId, limit, skip });
    const rs = messages.map((i) => {
      if (i.userId.equals(req.user._id)) i.isMe = true;
      else i.isMe = false;
      return i;
    });
    Result.success(res, { rs });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { msgContent, roomId } = req.body.data;
    console.log(msgContent, roomId);
    const theLastest = await Message.findOne({ roomId: roomId }).sort({ createdAt: -1 }).lean();
    if (theLastest && !theLastest._id.equals(messageId))
      return Result.error(res, { message: 'Không thể cập nhật tin nhắn' });
    const updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content: msgContent } }, { new: true });
    return Result.success(res, { updatedMessage });
  } catch (err) {
    next(err);
  }
};

const deleteOne = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (message == null) return Result.error(res, { message: 'tin nhắn không tồn tại' });
    if ((Date.now() - message.createdAt) / (1000 * 3600 * 24) >= 1)
      return Result.error(res, { message: 'Sau 24 giờ gửi, tin nhắn không thể xoá' });
    await Message.findByIdAndDelete(message._id);
    return Result.success(res, { message });
  } catch (err) {
    next(err);
  }
};

const messageController = {
  getAllInRoom,
  update,
  deleteOne,
};

export default messageController;
