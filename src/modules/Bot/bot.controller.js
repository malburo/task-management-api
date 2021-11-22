import messageService from 'modules/Message/message.service';
import botService from './bot.service';
import Result from 'helpers/result.helper';

const sendRequest = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { roomId, content } = req.body;
    const userId = req.user._id;
    const bot = await botService.getBot();
    const message = await messageService.create({
      roomId: roomId,
      content,
      userId,
      readBy: [userId, bot._id],
      type: 1,
    });
    io.sockets.in(roomId).emit('chat:add-message', { message });
    Result.success(res, { message });
    const messageResponse = await botService.detectIntent({ query: content, roomId, botId: bot._id, userId });
    io.sockets.in(roomId).emit('chat:add-message', { message: messageResponse });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { io } = req.app;
    const { content, roomId } = req.body;
    const bot = await botService.getBot();
    const message = await messageService.create({
      roomId,
      content: content,
      userId: bot._id,
      readBy: [req.user._id, bot._id],
      type: 1,
    });
    io.sockets.in(roomId).emit('chat:add-message', { message });
    Result.success(res, { message });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const botController = {
  sendRequest,
  createMessage,
};

export default botController;
