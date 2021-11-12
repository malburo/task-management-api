import express from 'express';
import memberController from './member.controller';
const MemberRouter = express.Router();

MemberRouter.route('/').post(memberController.create);
MemberRouter.route('/board/:boardId/user/:userId').get(memberController.getOne);

export default MemberRouter;
