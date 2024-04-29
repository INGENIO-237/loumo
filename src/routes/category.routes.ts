import "reflect-metadata";

import { Router } from "express";
import Container from "typedi";
import CategoryController from "../controllers/category.controller";
import { tryCatch } from "../utils/errors/errors.utils";
import validate from "../middlewares/validate.request";
import { createCategorySchema } from "../schemas/category.schemas";
import isAuthenticated from "../middlewares/isAuthenticated";

const CategoryRoutes = Router();

const controller = Container.get(CategoryController);

CategoryRoutes.get("", tryCatch(controller.getCategories.bind(controller)));
CategoryRoutes.post(
  "",
  isAuthenticated,
  validate(createCategorySchema),
  tryCatch(controller.createCategory.bind(controller))
);

export default CategoryRoutes;
