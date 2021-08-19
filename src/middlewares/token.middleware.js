import jwt from 'jsonwebtoken';
import authController from 'modules/Auth/auth.controller';
import Result from '../helpers/result.helper';
import User from '../modules/User/user.model';

const checkToken = async (req, res, next) => {
  try {
    let token = req.cookies['access_token'];
    console.log(token);
    if (!token) {
      return Result.error(res, { message: 'No token provided' }, 403);
    }
    const decode = await jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decode.id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(authController.logout);
  }
};
export default checkToken;
