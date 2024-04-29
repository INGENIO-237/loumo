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

    req.body[file.fieldname] = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    fs.unlink(file.path, (error) => {
      if (error) logger.error(error);
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export async function deleteImage(image: CloudinaryResource) {
  image.publicId && (await cloudinary.uploader.destroy(image.publicId));
}
