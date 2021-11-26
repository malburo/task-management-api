import Activity from './activity.model';

const getActivityByBoardId = async ({ page = 1, limit = 8, q = '' }, boardId) => {
  try {
    const activities = await Activity.find({ boardId })
      .limit(parseInt(limit))
      .skip(parseInt(page - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('senderId')
      .lean();
    const total = await Activity.find({ boardId }).countDocuments();
    return { activities, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const getActivityByMember = async ({ page = 1, limit = 8, q = '' }, { boardId, memberId }) => {
  try {
    const activities = await Activity.find({ boardId, senderId: memberId })
      .limit(parseInt(limit))
      .skip(parseInt(page - 1) * parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('senderId')
      .lean();
    const total = await Activity.find({ boardId }).countDocuments();
    return { activities, pagination: { page, limit, total } };
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  try {
    const newActivity = await Activity.create(data);
    return newActivity;
  } catch (error) {
    throw error;
  }
};

const activityService = { getActivityByBoardId, getActivityByMember, create };
export default activityService;
