import Result from 'helpers/result.helper';
import messageService from './message.service';

const getAllInRoom = async (req, res, next) => {
  try {
    const data = req.params;
    const messages = await messageService.getAllInRoom({ roomId: data });
    Result.success(res, { messages });
  } catch (err) {
    next(err);
  }
};

const messageController = {
  getAllInRoom,
};

export default messageController;
