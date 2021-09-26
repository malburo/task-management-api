import checkToken from 'middlewares/token.middleware';
import AuthRouter from 'modules/Auth/auth.route';
import BoardRouter from 'modules/Board/board.route';
import ColumnRouter from 'modules/Column/column.route';
import MemberRouter from 'modules/Member/member.route';
import MesssageRouter from 'modules/Message/message.route';
import RoomRouter from 'modules/Room/room.route';
import TaskRouter from 'modules/Task/task.route';
import UserRouter from 'modules/User/user.route';

const MasterRouter = (app) => {
  app.use('/api/auth', AuthRouter);
  app.use('/api/boards', checkToken, BoardRouter);
  app.use('/api/columns', checkToken, ColumnRouter);
  app.use('/api/tasks', checkToken, TaskRouter);
  app.use('/api/members', checkToken, MemberRouter);
  app.use('/api/users', checkToken, UserRouter);
  app.use('/api/rooms', checkToken, RoomRouter);
  app.use('/api/messages', checkToken, MesssageRouter);
};

export default MasterRouter;
