import { logger } from 'config/logger.config';
import { morganAwesome } from 'config/morgan.config';
import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import passport from 'passport';
import path from 'path';
import socketIo from 'socket.io';
import { connectDB } from './db';
import Result from './helpers/result.helper';
import MasterRouter from './routes';

require('dotenv').config();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.CLIENT_URL } });
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
server.listen(port, () => {
  logger('Success', `listening on *:${port}`);
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
};

io.on('connection', onConnection);
