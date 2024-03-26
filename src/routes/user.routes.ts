import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import UserController from "../controllers/user.controller";

const UsersRouter = Router();

const controller = Container.get(UserController);

UsersRouter.get("", controller.getUsers.bind(controller));

export default UsersRouter;
