import express from 'express';
import labelController from './label.controller';
const LabelRouter = express.Router();

LabelRouter.route('/').post(labelController.create);

export default LabelRouter;
