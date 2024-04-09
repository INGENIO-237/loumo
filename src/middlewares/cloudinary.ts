import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger";
import fs from "node:fs";

export default async function uploadToCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const file = req.file;

    if (files) {
      const keys = Object.keys(files);

      for (let key of keys) {
        const fileList = files[key]; // Ex: logo: [{}, {}, ...]
        for (let file of fileList) {
          await uploader(req, file);
        }
      }
    }

    if (file) await uploader(req, file);

    return next();
  } catch (error) {
    return next(error);
  }
}

async function uploader(req: Request, file: Express.Multer.File) {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    
    req.body[file.fieldname] = result.secure_url;

    fs.unlink(file.path, (error) => {
      if (error) logger.error(error);
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
