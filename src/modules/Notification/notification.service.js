import Notification from './notification.model';

const getAll = async ({ page = 1, limit = 5, q = '' }, userId) => {
  try {
    const notifications = await Notification.find({ receiverId: userId })
      .limit(parseInt(limit))
      .skip(parseInt(page - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('senderId')
      .lean();
    const total = await Notification.find({ receiverId: userId }).countDocuments();
    return { notifications, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newNotification = await Notification.create(data);
    return newNotification;
  } catch (error) {
    throw error;
  }
};

const update = async (notificationId, updateData) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { $set: updateData },
      { new: true }
    ).lean();
    return updatedNotification;
  } catch (error) {
    throw error;
  }
};

const deleteAll = async (userId) => {
  try {
    const deletedNotification = await Notification.deleteMany({ receiverId: userId }).lean();
    return deletedNotification;
  } catch (error) {
    throw error;
  }
};

const notificationService = { getAll, create, update, deleteAll };
export default notificationService;
