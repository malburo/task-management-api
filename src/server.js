import { logger } from 'config/logger.config';
import { morganAwesome } from 'config/morgan.config';
import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import Message from 'modules/Message/message.model';
import messageService from 'modules/Message/message.service';
import passport from 'passport';
import path from 'path';
import socketIo from 'socket.io';
import { connectDB } from './db';
import Result from './helpers/result.helper';
import MasterRouter from './routes';

require('dotenv').config();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'http://localhost:3000' } });
const app = express();
const port = process.env.PORT || 8000;
const socketPort = 8001;

app.use(morganAwesome);

app.use(cookieParser());
app.use(cors({}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
configPassportGithub();
MasterRouter(app);

app.use(function (err, req, res, next) {
  return Result.error(res, { message: err.message }, 500);
});

app.listen(port, () => {
  logger('Success', `App listening at http://localhost:${port}`);
});
server.listen(socketPort, () => {
  logger('Success', `listening on *:${socketPort}`);
});

const onConnection = (socket) => {
  app.io = io;
  app.socket = socket;
  socket.on('board:join', (boardId) => {
    socket.join(boardId);
  });
  socket.on('board:leave', (boardId) => {
    socket.leave(boardId);
  });
  socket.on('chat:joinRoom', async (data) => {
    socket.join(data.roomId);
  });
  socket.on('chat:leaveRoom', (data) => {
    socket.leave(data.roomId);
  });
  socket.on('chat:newMessage', async (data) => {
    let newMessage = await Message.create({ roomId: data.to, userId: data.from, content: data.message });
    let message = await Message.findById(newMessage._id).populate('postedBy').lean();
    io.to(data.to).emit('chat:messageCommit', message);
  });

  socket.on('chat:deleteMessage', async (data) => {
    try {
      const message = await messageService.deleteOne(data.messageId);
      io.to(data.to).emit('chat:deleteResult', { status: 1, message });
      socket.emit('chat:ownerDeleteResult', { status: 1 });
    } catch {
      io.to(data.to).emit('chat:deleteResult', { status: -1 });
      socket.emit('chat:ownerDeleteResult', { status: -1 });
    }
  });

  socket.on('chat:typing', (data) => {
    socket.to(data.to).emit('chat:trackTyping', { typingUser: data.name });
  });
  socket.on('chat:stopTyping', (data) => {
    socket.to(data.to).emit('chat:trackStopTyping', { typingUser: data.name });
  });

  socket.on('chat:editMessage', async (data) => {
    try {
      const message = await messageService.updateOne({
        msgContent: data.newContent,
        roomId: data.to,
        messageId: data.messageId,
      });
      io.to(data.to).emit('chat:editResult', { status: 1, message });
      socket.emit('chat:ownerEditResult', { status: 1 });
    } catch {
      io.to(data.to).emit('chat:editResult', { status: -1 });
      socket.emit('chat:ownerEditResult', { status: -1 });
    }
  });
};

io.on('connection', onConnection);
