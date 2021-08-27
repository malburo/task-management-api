import checkToken from 'middlewares/token.middleware';
import AuthRouter from 'modules/Auth/auth.route';
import BoardRouter from 'modules/Board/board.route';
import ColumnRouter from 'modules/Column/column.route';
import TaskRouter from 'modules/Task/task.route';

const MasterRouter = (app) => {
  app.use('/api/auth', AuthRouter);
  app.use('/api/boards', checkToken, BoardRouter);
  app.use('/api/columns', checkToken, ColumnRouter);
  app.use('/api/tasks', checkToken, TaskRouter);
};

export default MasterRouter;
