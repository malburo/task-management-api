import Activity from './activity.model';

const getActivityByBoardId = async (boardId) => {
  try {
    const activities = await Activity.find({ boardId });
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

const activityService = { getActivityByBoardId, create };
export default activityService;
