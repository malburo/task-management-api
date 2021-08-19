import cors from 'cors';
import express from 'express';
import path from 'path';
import { connectDB } from './db';
import Result from './helpers/result.helper';
import MasterRouter from './routes';
import morgan from 'morgan';
import { configPassportGithub } from 'config/passportGithub.config';
import passport from 'passport';
import cookieParser from 'cookie-parser';

require('dotenv').config();
connectDB();

const app = express();
const port = process.env.PORT || 8080;

app.use(morgan('tiny'));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cors({ origin: 'http://localhost:3000', credentials: true, proxy: true }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configPassportGithub();
MasterRouter(app);

app.use(function (err, req, res, next) {
  return Result.error(res, { message: err }, 500);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
