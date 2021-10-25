import Member from 'modules/Member/member.model';
import Result from '../../helpers/result.helper';
import User from '../User/user.model';

const searchUser = async (req, res, next) => {
  try {
    const { q } = req.query;
    const users = await User.aggregate([{ $match: { $text: { $search: q } } }]);
    return Result.success(res, { users });
  } catch (err) {
    next(err);
  }
};
const searchNewMember = async (req, res, next) => {
  try {
    const { q } = req.query;
    const { boardId } = req.params;
    const membersInBoard = await Member.find({ boardId });
    const membersArray = membersInBoard.map((member) => member.userId);
    const users = await User.aggregate([{ $match: { $text: { $search: q }, _id: { $nin: membersArray } } }]);
    return Result.success(res, { users });
  } catch (err) {
    next(err);
  }
};
const searchController = {
  searchUser,
  searchNewMember,
};

export default searchController;
