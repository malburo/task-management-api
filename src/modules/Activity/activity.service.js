import Activity from './activity.model';

const getActivityByBoardId = async (boardId) => {
  try {
    const activities = await Activity.find({ boardId }).sort({ createdAt: -1 }).populate('senderId').lean();
    return activities;
  } catch (error) {
    throw error;
  }
};

const getActivityByMember = async (boardId, memberId) => {
  try {
    const activities = await Activity.find({ boardId, senderId: memberId })
      .sort({ createdAt: -1 })
      .populate('senderId')
      .lean();
    return activities;
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
