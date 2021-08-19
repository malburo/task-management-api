import AuthRouter from 'modules/Auth/auth.route';

const MasterRouter = (app) => {
  app.use('/api/auth', AuthRouter);
  // app.use('/api/users', UserRouter);
  // app.use('/api/upload', checkToken, UploadRouter);
};

export default MasterRouter;
