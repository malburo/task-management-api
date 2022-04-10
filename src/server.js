import compression from 'compression';
import { morganAwesome } from 'config/morgan.config';
import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import handleError from 'helpers/handleError.helper.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import path from 'path';
import { Server } from 'socket.io';
import cloudinary from './config/cloudinary.config.js';
import { connectDB } from './db';
import MasterRouter from './routes';
import cron from 'node-cron';
import Task from 'modules/Task/task.model.js';
import notificationService from 'modules/Notification/notification.service.js';
import Column from 'modules/Column/column.model.js';
import { Types } from 'mongoose';
import taskService from 'modules/Task/task.service.js';
import { sendMail } from './config/nodemailer.config';
require('dotenv').config();

const app = express();
const httpServer = createServer(app);

connectDB();
configPassportGithub();
cloudinary.config();

app.use(compression({ level: 6 }));
app.use(morganAwesome);
app.use(cookieParser());
app.use(cors({}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
MasterRouter(app);
app.use(handleError);

const port = process.env.PORT || 8000;
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });
httpServer.listen(port);

const onConnection = (socket) => {
  app.io = io;
  app.socket = socket;
  socket.on('auth:token', async (token) => {
    try {
      if (token) {
        const decode = await jwt.verify(token, process.env.SECRET);
        if (decode) socket.join(decode.id);
      }
    } catch (error) {}
  });
  socket.on('test', async () => {
    app.io = io;
    app.socket = socket;
  });
  socket.on('board:join', (boardId) => {
    socket.join(boardId);
  });
  socket.on('board:leave', (boardId) => {
    socket.leave(boardId);
  });
  socket.on('task:join', (taskId) => {
    socket.join(taskId);
  });
  socket.on('task:leave', (taskId) => {
    socket.leave(taskId);
  });
  socket.on('chat:join', async (roomId) => {
    socket.join(roomId);
  });
  socket.on('chat:leave', (roomId) => {
    socket.leave(roomId);
  });
  socket.on('whiteboard:join', async (whiteboardId) => {
    socket.join(whiteboardId);
  });
  socket.on('whiteboard:leave', (whiteboardId) => {
    socket.leave(whiteboardId);
  });
};

io.on('connection', onConnection);

// cron.schedule('*/60 * * * * *', async () => {
//   try {
//     const deadlineExpired = await Task.updateMany(
//       { deadlineDay: { $lt: Date.now() }, status: { $in: ['DOING', 'REMINDER'] } },
//       { status: 'DEADLINE_PUSH' }
//     );
//     const reminder = await Task.updateMany(
//       { reminderDay: { $lt: Date.now() }, status: 'DOING' },
//       { status: 'REMINDER_PUSH' }
//     );
//     if (reminder.n !== 0) {
//       const tasks = await Task.find({ status: 'REMINDER_PUSH' }).lean();
//       if (!tasks) return;
//       tasks.forEach(async (task) => {
//         const column = await Column.findOne({ taskOrder: Types.ObjectId(task._id) });
//         const newNotification = await notificationService.create({
//           content: { task },
//           receiverId: task.membersId,
//           type: 'TASK:REMINDER',
//           boardId: column.boardId,
//         });
//         const updatedTask = await taskService.update(task._id, { status: 'REMINDER' });
//         const emailList = updatedTask.membersId.map((member) => member.email);
//         await sendMail(emailList, 'hihihihihihihihi @@@');
//         const membersId = task.membersId.map((item) => item.toString());
//         io.sockets.in(membersId).emit('notification:create', newNotification);
//         io.sockets.in(column.boardId.toString()).emit('task:update', updatedTask);
//       });
//       return;
//     }
//     if (deadlineExpired.n !== 0) {
//       const tasks = await Task.find({ status: 'DEADLINE_PUSH' }).lean();
//       if (!tasks) return;
//       tasks.forEach(async (task) => {
//         const column = await Column.findOne({ taskOrder: Types.ObjectId(task._id) });
//         const newNotification = await notificationService.create({
//           content: { task },
//           receiverId: task.membersId,
//           type: 'TASK:DEADLINE_EXPIRED',
//           boardId: column.boardId,
//         });
//         const updatedTask = await taskService.update(task._id, { status: 'DEADLINE_EXPIRED' });
//         const membersId = task.membersId.map((item) => item.toString());
//         io.sockets.in(membersId).emit('notification:create', newNotification);
//         io.sockets.in(column.boardId.toString()).emit('task:update', updatedTask);
//       });
//       return;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

export default io;
