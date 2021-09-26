import Notification from './notification.model';

const getAll = async ({ page = 1, limit = 5, q = '' }) => {
  try {
    const notifications = await Notification.find({});
    const total = await Notification.find({}).countDocuments();
    return { notifications, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newNotification = await Notification.create(data).lean();
    return newNotification;
  } catch (error) {
    throw error;
  }
};

const boardService = { getAll, create };
export default boardService;
