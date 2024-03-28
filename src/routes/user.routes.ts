import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import UserController from "../controllers/user.controller";
import validate from "../middlewares/validate.request";
import { createUserSchema } from "../schemas/user.schemas";

const UsersRouter = Router();

const controller = Container.get(UserController);

UsersRouter.get("", controller.getUsers.bind(controller));
UsersRouter.post(
  "",
  validate(createUserSchema),
  controller.createUser.bind(controller)
);

export default UsersRouter;
