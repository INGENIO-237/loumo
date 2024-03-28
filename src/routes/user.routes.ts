import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import UserController from "../controllers/user.controller";
import validate from "../middlewares/validate.request";
import { createUserSchema } from "../schemas/user.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const UsersRouter = Router();

const controller = Container.get(UserController);

UsersRouter.get("", tryCatch(controller.getUsers.bind(controller)));
UsersRouter.post(
  "",
  validate(createUserSchema),
  tryCatch(controller.createUser.bind(controller))
);

export default UsersRouter;
