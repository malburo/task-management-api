import { configPassportGithub } from 'config/passportGithub.config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import { connectDB } from './db';
import Result from './helpers/result.helper';
import MasterRouter from './routes';
import http from 'http';
import socketIo from 'socket.io';
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

require('dotenv').config();
connectDB();

const app = express();
const port = process.env.PORT || 8000;

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(cors({}));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configPassportGithub();
MasterRouter(app);

app.use(function (err, req, res, next) {
  console.log(err);
  return Result.error(res, { message: err }, 500);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

app.io = io;

server.listen(8001, () => {
  console.log('listening on *:8001');
});
