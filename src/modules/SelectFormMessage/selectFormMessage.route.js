import express from 'express';
import selectFormMessageController from './selectFormMessage.controller';

const SelectFormMessageRouter = express.Router();

SelectFormMessageRouter.route('/:formId/option').post(selectFormMessageController.addOption);

export default SelectFormMessageRouter;
