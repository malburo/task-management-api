import Result from 'helpers/result.helper';

const getAll = async (req, res, next) => {
  try {
    Result.success(res, {});
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
