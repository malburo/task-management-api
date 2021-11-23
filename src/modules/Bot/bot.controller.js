import messageService from 'modules/Message/message.service';
import botService from './bot.service';
import Result from 'helpers/result.helper';
import Room from 'modules/Room/room.model';
import columnService from 'modules/Column/column.service';
import boardService from 'modules/Board/board.service';
import Board from 'modules/Board/board.model';
import taskService from 'modules/Task/task.service';

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

    const botMsgWaiting = await botService.getLastBotWaiting(roomId);
    if (botMsgWaiting === null) {
      const messageResponse = await botService.detectIntent({ query: content, roomId, botId: bot._id, userId });
      io.sockets.in(roomId).emit('chat:add-message', { message: messageResponse });
      return;
    }
    let botResponse;
    const room = await Room.findById(roomId).lean();
    switch (botMsgWaiting.botWaiting) {
      case 'COLUMN:TITLE':
        const newColumn = await columnService.create({ title: content, boardId: room.boardId });
        const updatedBoard = await boardService.pushColumnOrder(room.boardId, newColumn._id);
        io.sockets
          .in(room.boardId.toString())
          .emit('column:create', { newColumn, newColumnOrder: updatedBoard.columnOrder });
        botResponse = await messageService.create({
          roomId,
          content: "Done! Let's check it out",
          userId: bot._id,
          readBy: [userId, bot._id],
          type: 1,
        });
        io.sockets.in(roomId).emit('chat:add-message', { message: botResponse });
        break;
      case 'TASK:COLUMN':
        const board = await Board.findById(room.boardId).lean();
        const countColumn = board.columnOrder.length;
        if (Number(content) !== NaN && Number(content) <= countColumn && Number(content) >= 0) {
          botResponse = await messageService.create({
            roomId,
            content: "OK! I remember it, then what's it title?",
            userId: bot._id,
            readBy: [userId, bot._id],
            botWaiting: 'TASK:TITLE',
            botSaveData: board.columnOrder[Number(content)],
            type: 1,
          });
        } else {
          botResponse = await messageService.create({
            roomId,
            content: 'Sorry! this column is not found',
            userId: bot._id,
            readBy: [userId, bot._id],
            type: 1,
          });
        }
        io.sockets.in(roomId).emit('chat:add-message', { message: botResponse });
        break;
      case 'TASK:TITLE':
        const newTask = await taskService.create({ title: content, columnId: botMsgWaiting.botSaveData });
        const updatedColumn = await columnService.pushTaskOrder(botMsgWaiting.botSaveData, newTask._id);
        io.sockets.in(room.boardId.toString()).emit('task:create', { newTask, newTaskOrder: updatedColumn.taskOrder });
        botResponse = await messageService.create({
          roomId,
          content: "Done! Let's check it out",
          userId: bot._id,
          readBy: [userId, bot._id],
          type: 1,
        });
        io.sockets.in(roomId).emit('chat:add-message', { message: botResponse });
        break;
      default:
        const messageResponse = await botService.detectIntent({ query: content, roomId, botId: bot._id, userId });
        io.sockets.in(roomId).emit('chat:add-message', { message: messageResponse });
        break;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const botController = { sendRequest };

export default botController;
