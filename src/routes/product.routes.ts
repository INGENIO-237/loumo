import "reflect-metadata";

import { Router, Request, Response, NextFunction } from "express";
import { tryCatch } from "../utils/errors/errors.utils";
import Container from "typedi";
import ProductController from "../controllers/product.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import uploadToCloudinary from "../middlewares/cloudinary.upload";
import upload from "../utils/multer";
import validate from "../middlewares/validate.request";
import {
  createProductSchema,
  filterProductsSchema,
  getProductSchema,
} from "../schemas/product.schemas";

const ProductRouter = Router();
const controller = Container.get(ProductController);

ProductRouter.get(
  "",
  validate(filterProductsSchema),
  tryCatch(controller.getProducts.bind(controller))
);
ProductRouter.post(
  "",
  isAuthenticated,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionals", maxCount: 4 },
  ]),
  validate(createProductSchema),
  uploadToCloudinary,
  tryCatch(controller.createProduct.bind(controller))
);
ProductRouter.get(
  "/store",
  isAuthenticated,
  validate(filterProductsSchema),
  tryCatch(controller.getStore.bind(controller))
);

ProductRouter.get(
  "/:product",
  validate(getProductSchema),
  tryCatch(controller.getProduct.bind(controller))
);

ProductRouter.delete(
  "/:product",
  tryCatch(controller.deleteProduct.bind(controller))
);

export default ProductRouter;
