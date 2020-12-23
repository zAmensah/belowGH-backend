const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: 'public',
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, file.filename + '-' + Date.now() + '.' + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({storage: fileStorage, fileFilter: fileFilter});
