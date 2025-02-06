import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { CONSTANTS } from "./constants.config";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, CONSTANTS.FILE_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedTypes = CONSTANTS.FILE_TYPES;

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: CONSTANTS.FILE_SIZE,
  },
});
