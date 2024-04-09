import { NextFunction, Request, Response } from "express";

export default function uploadToCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;
  const file = req.file;

  if (files) {
    const keys = Object.keys(files);

    for (let key of keys) {
      // Ex: logo: [{}, {}, ...]
      const fileList = files[key];
      for (let file of fileList) {
        uploader(req, file);
      }
    }
  }

  if (file) uploader(req, file);

  return next();
}

function uploader(req: Request, file: Express.Multer.File) {
  req.body[file.fieldname] = file.path;
}
