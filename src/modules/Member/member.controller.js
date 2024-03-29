import Result from 'helpers/result.helper';
import activityService from 'modules/Activity/activity.service';
import Board from 'modules/Board/board.model';
import notificationService from 'modules/Notification/notification.service';
import roomService from 'modules/Room/room.service';
import userService from 'modules/User/user.service';
import Member from './member.model';
import memberService from './member.service';

const getAllMemberInBoard = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const members = await memberService.getAllMemberInBoard(data);
    Result.success(res, { members });
  } catch (error) {
    return next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const data = req.params;
    const member = await memberService.getOne(data);
    await Member.populate(member, 'member');
    Result.success(res, { member });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { userId, boardId } = req.body;
    const { io } = req.app;
    const checkExist = await Member.find({ userId, boardId });
    if (checkExist.length > 0) {
      return Result.error(res, 'This member has been added');
    }
    const data = { userId, boardId, role: 'MEMBER' };
    const newMemberRecord = await memberService.create(data);
    const newMember = await userService.getOne({ userId: newMemberRecord.userId });

    const newActivity = await activityService.create({
      content: {
        receiver: { _id: newMember._id, username: newMember.username },
      },
      senderId: req.user._id,
      type: 'BOARD:ADD_MEMBER',
      boardId,
    });
    newActivity.senderId = req.user;
    io.sockets.in(boardId).emit('activity:create', newActivity);

    const board = await Board.findById(boardId);
    const newNotification = await notificationService.create({
      content: {
        board: { _id: board._id, title: board.title, coverUrl: board.coverUrl },
      },
      senderId: req.user._id,
      type: 'BOARD:ADD_MEMBER',
      receiverId: newMember._id,
      boardId,
    });
    newNotification.senderId = req.user;
    io.sockets.in(newMember._id.toString()).emit('notification:create', newNotification);

    io.sockets.in(boardId).emit('member:create', newMember);
    Result.success(res, { newMember });
  } catch (error) {
    return next(error);
  }
};

const memberController = { getAllMemberInBoard, create, getOne };
export default memberController;
