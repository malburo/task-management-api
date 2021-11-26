import express from 'express';
import botController from './bot.controller';
const BotRouter = express.Router();

BotRouter.route('/request').post(botController.sendRequest);

export default BotRouter;
