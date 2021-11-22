import express from 'express';
import botController from './bot.controller';
const BotRouter = express.Router();

BotRouter.route('/request').post(botController.sendRequest);
BotRouter.route('/message').post(botController.createMessage);

export default BotRouter;
