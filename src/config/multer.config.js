import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    //reject file
    cb('Only image/jpeg or image/png files are allowed!');
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
