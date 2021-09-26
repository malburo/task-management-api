import express from 'express';
import memberController from './member.controller';
const MemberRouter = express.Router();

MemberRouter.route('/').post(memberController.create);

export default MemberRouter;
