import "reflect-metadata";

import { Router } from "express";
import upload from "../utils/multer";
import Container from "typedi";
import StoreController from "../controllers/store.controller";
import { tryCatch } from "../utils/errors/errors.utils";
import uploadToCloudinary from "../middlewares/cloudinary.upload";
import isAuthenticated from "../middlewares/isAuthenticated";
import validate from "../middlewares/validate.request";
import { createStoreSchema, updateStoreSchema } from "../schemas/store.schemas";

const StoreRouter = Router();
const controller = Container.get(StoreController);

StoreRouter.get(
  "",
  isAuthenticated,
  tryCatch(controller.getCurrentUserStores.bind(controller))
);

StoreRouter.post(
  "",
  isAuthenticated,
  // validate(createStoreSchema),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  uploadToCloudinary,
  tryCatch(controller.createStore.bind(controller))
);

StoreRouter.put(
  "/:storeId",
  isAuthenticated,
  validate(updateStoreSchema),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  uploadToCloudinary,
  tryCatch(controller.updateStore.bind(controller))
);

export default StoreRouter;
