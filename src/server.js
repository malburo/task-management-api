import { morganAwesome } from 'config/morgan.config';
import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import handleError from 'helpers/handleError.helper.js';
import { createServer } from 'http';
import passport from 'passport';
import path from 'path';
import { Server } from 'socket.io';
import cloudinary from './config/cloudinary.config.js';
import { connectDB } from './db';
import MasterRouter from './routes';

require('dotenv').config();

const app = express();
const httpServer = createServer(app);

connectDB();
configPassportGithub();
cloudinary.config();

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
  socket.on('board:join', (boardId) => {
    socket.join(boardId);
  });
  socket.on('board:leave', (boardId) => {
    socket.leave(boardId);
  });
};

io.on('connection', onConnection);
