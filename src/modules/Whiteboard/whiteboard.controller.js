import Result from 'helpers/result.helper';
import whiteboardService from './whiteboard.service';

const getOne = async (req, res, next) => {
  try {
    const { whiteboardId } = req.params;
    const { whiteboard } = await whiteboardService.getOne(whiteboardId);
    Result.success(res, { whiteboard });
  } catch (error) {
    return next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { boardId } = req.query;
    const { whiteboards, pagination } = await whiteboardService.getAll(req.query, boardId);
    Result.success(res, { whiteboards, pagination });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newWhiteboard = await whiteboardService.create(req.body);
    Result.success(res, { newWhiteboard });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { whiteboardId } = req.params;
    const { io, socket } = req.app;
    console.log('id', socket.id);
    const updateData = { ...req.body, updateAt: Date.now() };
    if (updateData._id) delete updateData._id;

    const updatedWhiteboard = await whiteboardService.update(whiteboardId, updateData);

    socket.broadcast.to(whiteboardId).emit('whiteboard:update', updatedWhiteboard);
    // io.sockets.in(whiteboardId).emit('whiteboard:update', updatedWhiteboard);
    Result.success(res, { updatedWhiteboard });
  } catch (error) {
    return next(error);
  }
};
const taskController = { getOne, getAll, create, update };
export default taskController;
