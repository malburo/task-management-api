import Result from 'helpers/result.helper';
import activityService from './activity.service';

const getActivityByBoardId = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { activities, pagination } = await activityService.getActivityByBoardId(req.query, boardId);
    Result.success(res, { activities, pagination });
  } catch (error) {
    return next(error);
  }
};

const getActivityByMemberId = async (req, res, next) => {
  try {
    const { boardId, memberId } = req.params;
    const { activities, pagination } = await activityService.getActivityByMember(req.query, { boardId, memberId });
    Result.success(res, { activities, pagination });
  } catch (error) {
    return next(error);
  }
};

const historyController = { getActivityByBoardId, getActivityByMemberId };
export default historyController;
