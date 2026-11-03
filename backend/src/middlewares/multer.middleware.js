import multer from "multer";

const MAX_UPLOAD_FILE_SIZE = 2 * 1024 * 1024;

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/tmp/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_FILE_SIZE },
});
