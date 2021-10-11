import { morganAwesome } from 'config/morgan.config';
import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import passport from 'passport';
import path from 'path';
import { Server } from 'socket.io';
import { connectDB } from './db';
import Result from './helpers/result.helper';
import MasterRouter from './routes';

require('dotenv').config();

const app = express();
const httpServer = createServer(app);

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

app.get('/', (req, res) => {
  res.send('Welcome to task management <3');
});

app.use(function (err, req, res, next) {
  return Result.error(res, { message: err.message }, 500);
});

const port = process.env.PORT || 8000;
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });
httpServer.listen(port);

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
