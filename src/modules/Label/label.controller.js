import Result from 'helpers/result.helper';
import Label from './label.model';
import labelService from './label.service';

const getAll = async (req, res, next) => {
  try {
    const labels = await labelService.getAll();
    Result.success(res, { labels });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { name, color } = req.body;
    const { io } = req.app;
    const checkExist = await Label.find({ name, color, boardId });
    if (checkExist.length > 0) {
      return Result.error(res, 'This label already exists');
    }
    const newLabel = await labelService.create({ name, color, boardId });
    io.sockets.in(boardId).emit('label:create', newLabel);
    Result.success(res, { newLabel });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { labelId, boardId } = req.params;
    const { io } = req.app;
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;

    const updatedLabel = await labelService.update(labelId, updateData);
    io.sockets.in(boardId).emit('label:update', updatedLabel);
    Result.success(res, { updatedLabel });
  } catch (error) {
    return next(error);
  }
};

const labelController = { getAll, create, update };
export default labelController;
