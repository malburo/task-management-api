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
  socket.on('chat:join', async (data) => {
    socket.join(data.roomId);
  });
  socket.on('chat:leave', (data) => {
    socket.leave(data.roomId);
  });
};

io.on('connection', onConnection);

cron.schedule('*/60 * * * * *', async () => {
  try {
    const a = await Task.updateMany({ deadlineDay: { $lt: Date.now() }, status: 'UNFINISHED' }, { status: 'PUSH' });
    if (a.n === 0) return;

    const tasks = await Task.find({ status: 'PUSH' }).lean();
    if (!tasks) return;
    tasks.forEach(async (task) => {
      const column = await Column.findOne({ taskOrder: Types.ObjectId(task._id) });
      const newNotification = await notificationService.create({
        content: {
          task: { _id: task._id, title: task.title },
        },
        receiverId: task.membersId,
        type: 'TASK:DEADLINE_EXPIRED',
        boardId: column.boardId,
      });
      const updatedTask = await taskService.update(task._id, { status: 'DEADLINE_EXPIRED' });
      io.sockets.in(task.membersId).emit('notification:create', newNotification);
      io.sockets.in(column.boardId.toString()).emit('task:update', updatedTask);
    });
  } catch (error) {
    console.log(error);
  }
});

export default io;
