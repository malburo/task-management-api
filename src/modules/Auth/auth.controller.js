import bcrypt from 'bcrypt';
import Result from '../../helpers/result.helper';
import { createAccessToken } from '../../helpers/token.helper';
import User from '../User/user.model';

const getMe = async (req, res, next) => {
  try {
    Result.success(res, { currentUser: req.user }, 201);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return Result.error(res, { message: 'Email does not exist' }, 401);
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return Result.error(res, { message: 'Wrong password' }, 401);
    }
    const access_token = createAccessToken(user);
    res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none' });
    Result.success(res);
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const checkEmail = await User.find({ email }).countDocuments();
    if (checkEmail) {
      return Result.error(res, { message: 'Email này đã được sử dụng' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      profilePictureUrl: `https://avatars.dicebear.com/4.5/api/initials/${fullname}.svg`,
    });
    const access_token = createAccessToken(newUser);
    res.cookie('access_token', access_token, { httpOnly: true, sameSite: 'none' });
    Result.success(res);
  } catch (error) {
    return next(error);
  }
};

const loginWithGithub = async (req, res, next) => {
  try {
    const { email, username, avatar_url } = req.federatedUser._json;
    const checkUser = await User.find({ email });
    if (checkUser.length) {
      const access_token = createAccessToken(checkUser);
      res.cookie('access_token', access_token, { httpOnly: true });
      res.redirect('http://localhost:3000/profile');
      return;
    }
    const newUser = await User.create({
      fullname: username,
      email,
      profilePictureUrl: avatar_url,
    });
    const access_token = createAccessToken(newUser);
    res.cookie('access_token', access_token);
    res.redirect('http://localhost:3000/profile');
  } catch (error) {
    return next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    Result.success(res);
  } catch (error) {
    return next(error);
  }
};
const authController = { login, register, getMe, loginWithGithub, logout };
export default authController;
