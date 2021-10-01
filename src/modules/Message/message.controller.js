import Result from 'helpers/result.helper';
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

const messageController = {
  getAllInRoom,
};

export default messageController;
