import multer, { diskStorage } from "multer";
import { fileTypeValidation } from "./fileTypeValidation.js";

export const uploadFile = () => {
  let fileFilter = (req, file, cb) => {
    console.log(file);
    if (!fileTypeValidation.image.includes(file.mimetype)) {
      return cb(new Error("invalid file type!", { cause: 400 }), false);
    }

    return cb(null, true);
  };

  return multer({ storage: diskStorage({}), fileFilter });
};
