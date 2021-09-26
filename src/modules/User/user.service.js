import User from './user.model';

const getOne = async ({ userId }) => {
  try {
    const user = await User.findById(userId).lean();
    return user;
  } catch (error) {
    return next(error);
  }
};

const userService = { getOne };
export default userService;
