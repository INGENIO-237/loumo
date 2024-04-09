import "reflect-metadata";

import { Request, Response, Router } from "express";
import upload from "../utils/multer";
import Container from "typedi";
import StoreController from "../controllers/store.controller";
import { tryCatch } from "../utils/errors/errors.utils";
import uploadToCloudinary from "../middlewares/cloudinary";

const StoreRouter = Router();
const controller = Container.get(StoreController);

StoreRouter.post(
  "",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  uploadToCloudinary,
  tryCatch(controller.createStore.bind(controller))
);

export default StoreRouter;
