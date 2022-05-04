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

const update = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const updateData = { ...req.body, updateAt: Date.now() };
    const updatedNotification = await notificationService.update(notificationId, updateData);
    Result.success(res, { updatedNotification });
  } catch (error) {
    return next(error);
  }
};

const deleteAll = async (req, res, next) => {
  try {
    const deletedNotification = await notificationService.deleteAll(req.user._id);
    Result.success(res, { deletedNotification });
  } catch (error) {
    return next(error);
  }
};

const notificationController = { getAll, update, deleteAll };
export default notificationController;
