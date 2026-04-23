import type { Request } from "express";
import multer from "multer";
import AppError from "../errors/AppErrors.js";

const uploadImage = (fieldName: string) => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("The file must be image", 400));
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};

export default uploadImage;
