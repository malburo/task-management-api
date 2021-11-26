import Result from 'helpers/result.helper';
import notificationService from './notification.service';

const getAll = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { notifications, pagination } = await notificationService.getAll(req.query, userId);
    Result.success(res, { notifications, pagination });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    Result.success(res, {});
  } catch (error) {
    return next(error);
  }
};

const notificationController = { create, getAll };
export default notificationController;
