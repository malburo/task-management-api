import Result from 'helpers/result.helper';
import memberService from './member.service';
import Member from './member.model';
import userService from 'modules/User/user.service';

const getAllMemberInBoard = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const members = await memberService.getAllMemberInBoard(data);
    Result.success(res, { members });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { userId, boardId } = req.body;
    const checkExist = await Member.find({ userId, boardId });
    if (checkExist.length > 0) {
      return Result.error(res, 'User này đã là thành viên trong board');
    }
    const data = { userId, boardId, role: 'MEMBER' };
    const newMemberRecord = await memberService.create(data);
    const newMember = await userService.getOne({ userId: newMemberRecord.userId });
    Result.success(res, { newMember });
  } catch (error) {
    return next(error);
  }
};

const memberController = { getAllMemberInBoard, create };
export default memberController;
