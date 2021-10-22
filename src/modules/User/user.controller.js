import bcrypt from 'bcrypt';
import Result from '../../helpers/result.helper';
import User from '../User/user.model';
import userService from './user.service';

const getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    if (req.query.search) {
      const users = await User.find({ $or: [{ email: search }, { username: search }] });
      return Result.success(res, { users }, 201);
    }
    const users = await User.find({});
    Result.success(res, { users }, 201);
  } catch (error) {
    return next(error);
  }
};

const updateInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData.password) delete updateData.password;

    const updatedUser = await userService.update(userId, updateData);
    Result.success(res, { updatedUser });
  } catch (error) {
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, currentUser);
    const comparePassword = await bcrypt.compare(currentPassword, currentUser.password);
    if (!comparePassword) {
      return Result.error(res, { message: 'Current password is wrong' }, 401);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updateData = { password: hashedPassword, updateAt: Date.now() };
    const updatedUser = await userService.update(currentUser._id, updateData);
    Result.success(res, { updatedUser });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    Result.success(res, { user }, 201);
  } catch (error) {
    return next(error);
  }
};

const userController = { getAll, updateInfo, updatePassword, deleteUser };
export default userController;
