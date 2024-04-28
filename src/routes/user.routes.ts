import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import UserController from "../controllers/user.controller";
import validate from "../middlewares/validate.request";
import {
  createUserSchema,
  updateUserProfileSchema,
} from "../schemas/user.schemas";
import { tryCatch } from "../utils/errors/errors.utils";
import isAuthenticated from "../middlewares/isAuthenticated";

const UsersRouter = Router();

const controller = Container.get(UserController);

UsersRouter.get(
  "",
  isAuthenticated,
  tryCatch(controller.getUsers.bind(controller))
);
UsersRouter.post(
  "",
  validate(createUserSchema),
  tryCatch(controller.createUser.bind(controller))
);
UsersRouter.put(
  "/profile",
  isAuthenticated,
  validate(updateUserProfileSchema),
  tryCatch(controller.updateUserProfile.bind(controller))
);
UsersRouter.put(
  "/become-merchant",
  isAuthenticated,
  tryCatch(controller.becomeMerchant.bind(controller))
);
UsersRouter.delete(
  "/delete-my-account",
  isAuthenticated,
  tryCatch(controller.deleteMyAccount.bind(controller))
);

export default UsersRouter;
