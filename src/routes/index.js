import checkToken from 'middlewares/token.middleware';
import AuthRouter from 'modules/Auth/auth.route';
import BoardRouter from 'modules/Board/board.route';
import ColumnRouter from 'modules/Column/column.route';
import MemberRouter from 'modules/Member/member.route';
import SearchRouter from 'modules/Search/search.route';
import TaskRouter from 'modules/Task/task.route';
import UploadRouter from 'modules/Upload/upload.route';
import UserRouter from 'modules/User/user.route';

const MasterRouter = (app) => {
  app.use('/api/auth', AuthRouter);
  app.use('/api/boards', checkToken, BoardRouter);
  app.use('/api/columns', checkToken, ColumnRouter);
  app.use('/api/tasks', checkToken, TaskRouter);
  app.use('/api/members', checkToken, MemberRouter);
  app.use('/api/users', checkToken, UserRouter);
  app.use('/api/search', checkToken, SearchRouter);
  app.use('/api/uploads', UploadRouter);
};

export default MasterRouter;
