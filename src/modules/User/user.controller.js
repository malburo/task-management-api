import bcrypt from 'bcrypt';
import Result from '../../helpers/result.helper';
import User from '../User/user.model';

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
    const { fullname, email, bio } = req.body;
    if (email === req.user.email) {
      await User.updateOne({ _id: req.user.id }, { $set: { fullname, bio } });
      const userUpdated = await User.findById(req.user.id);
      Result.success(res, { currentUser: userUpdated }, 201);
      return;
    }
    const checkEmail = await User.find({ email }).countDocuments();
    if (checkEmail) {
      return Result.error(res, { message: 'This email has been used' });
    }
    await User.updateOne({ _id: req.user.id }, { $set: { fullname, email, bio } });
    const userUpdated = await User.findById(req.user.id);
    Result.success(res, { currentUser: userUpdated }, 201);
  } catch (error) {
    return next(error);
  }
};
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const comparePassword = await bcrypt.compare(currentPassword, req.user.password);
    if (!comparePassword) {
      return Result.error(res, { message: 'Current password is wrong' }, 401);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.updateOne({ _id: req.user.id }, { $set: { password: hashedPassword } });
    Result.success(res, { status: 'Password updated successfully' }, 201);
  } catch (error) {
    return next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { profilePictureUrl } = req.body;
    await User.updateOne({ _id: req.user.id }, { $set: { profilePictureUrl } });
    const userUpdated = await User.findById(req.user.id);
    Result.success(res, { currentUser: userUpdated }, 201);
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

const userController = { getAll, updateInfo, updatePassword, updateAvatar, deleteUser };
export default userController;
