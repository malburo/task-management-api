import Board from 'modules/Board/board.model';
import Message from 'modules/Message/message.model';
import messageService from 'modules/Message/message.service';
import Room from 'modules/Room/room.model';
import User from '../User/user.model';
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const getBot = async () => {
  try {
    let bot = await User.findOne({ username: 'bot' }).lean();
    if (bot == null)
      bot = await User.create({
        username: 'bot',
        fullname: 'TASKER',
        email: 'bot',
        profilePictureUrl:
          'https://www.cambridge.org/elt/blog/wp-content/uploads/2020/08/GettyImages-1221348467-e1597069527719.jpg',
      });
    return bot;
  } catch (err) {
    throw err;
  }
};

const detectIntent = async (data) => {
  try {
    const { query, botId, roomId, userId } = data;
    const sessionId = uuid.v4();
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath('task-manegement-oxbk', sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: query,
          // The language used by the client (en-US)
          languageCode: 'en-US',
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    const messageBot = await createBotMessage({ result, roomId, userId, botId });
    return messageBot;
  } catch (error) {
    console.log(error);
    throw err;
  }
};

const getLastBotWaiting = async (data) => {
  try {
    const bot = await getBot();
    const message = await Message.findOne({ userId: bot._id, roomId: data }).sort({ createdAt: -1 }).lean();
    return message;
  } catch (error) {
    return null;
  }
};

const createBotMessage = async (data) => {
  try {
    const { result, roomId, userId, botId } = data;
    let response;
    switch (result.intent.displayName) {
      case 'COLUMN:CREATE':
        response = await messageService.create({
          roomId: roomId,
          content: result.fulfillmentText,
          userId: botId,
          readBy: [userId, botId],
          type: 1,
          botWaiting: 'COLUMN:TITLE',
        });
        break;
      case 'TASK:CREATE':
        const room = await Room.findById(roomId).populate('board').lean();
        if (room.board.columnOrder.length === 0)
          response = await messageService.create({
            roomId: roomId,
            content: 'You have no column in board, please create one first',
            userId: botId,
            readBy: [userId, botId],
            type: 1,
          });
        else {
          const board = await Board.findById(room.boardId).populate('columns').lean();
          let textResponse = `${result.fulfillmentText} <br>
          Type number: <br> `;
          board.columns.map((item, index) => (textResponse += index + '. ' + item.title + '<br>'));
          response = await messageService.create({
            roomId: roomId,
            content: textResponse,
            userId: botId,
            readBy: [userId, botId],
            type: 1,
            botWaiting: 'TASK:COLUMN',
          });
        }
        break;
      case 'COLUMN:EDIT':
        response = await messageService.create({
          roomId: roomId,
          content: result.fulfillmentText,
          userId: botId,
          readBy: [userId, botId],
          type: 1,
        });
        response.type = 6;
        break;
      default:
        response = await messageService.create({
          roomId: roomId,
          content: result.fulfillmentText,
          userId: botId,
          readBy: [userId, botId],
          type: 1,
        });
        break;
    }
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const botService = {
  getBot,
  detectIntent,
  getLastBotWaiting,
};

export default botService;
