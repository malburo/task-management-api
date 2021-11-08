import express from 'express';
import labelController from './label.controller';
const LabelRouter = express.Router({ mergeParams: true });

LabelRouter.route('/').post(labelController.create);
LabelRouter.route('/:labelId').put(labelController.update);

export default LabelRouter;
