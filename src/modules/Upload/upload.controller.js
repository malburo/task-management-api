import Result from 'helpers/result.helper';
import cloudinary from 'cloudinary';
const fs = require('fs');

const upload = async (req, res, next) => {
  try {
    if (!req.file && !req.files) {
      return Result.error(res, { message: 'File is empty' }, 401);
    }
    const result = await cloudinary.v2.uploader.upload(req.file.path, { resource_type: 'auto' });
    console.log(result);
    Result.success(res, { result });
  } catch (error) {
    next(error);
  }
};

const uploadController = { upload };
export default uploadController;
