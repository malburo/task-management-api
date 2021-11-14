import Result from 'helpers/result.helper';
import activityService from './activity.service';

const getActivityByBoardId = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const activities = await activityService.getActivityByBoardId(boardId);
    Result.success(res, { activities });
  } catch (error) {
    return next(error);
  }
};

const historyController = { getActivityByBoardId };
export default historyController;
