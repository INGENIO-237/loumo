import { Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import logger from "./logger";
import { CloudinaryResource } from "../types/product.types";

/**
 * Uploads image to cloudinary remote bucket and
 * parses req.body accordingly
 */
export async function uploader(req: Request, file: Express.Multer.File) {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    deleteImage(file);

    req.body[file.fieldname] = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    logger.error(error);
    removeTempImages(req);
    throw error;
  }
}

export async function deleteCloudinaryResource(resource: CloudinaryResource) {
  resource.publicId && (await cloudinary.uploader.destroy(resource.publicId));
}

export function removeTempImages(req: Request) {
  if (req.file) deleteImage(req.file);
  if (req.files) {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const keys = Object.keys(files);
    for (let key of keys) {
      const fileList = files[key]; // Ex: logo: [{}, {}, ...]
      for (let file of fileList) {
        deleteImage(file);
      }
    }
  }
}

export function deleteImage(file: Express.Multer.File) {
  fs.unlink(file.path, (error) => {
    if (error) logger.error(error);
  });
}
