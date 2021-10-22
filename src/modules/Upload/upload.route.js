import { upload } from 'config/multer.config';
import { Router } from 'express';
import uploadController from './upload.controller';

const UploadRouter = Router();

UploadRouter.route('/').post(upload.single('image'), uploadController.upload);

export default UploadRouter;
