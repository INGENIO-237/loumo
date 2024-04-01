import "reflect-metadata";
import { Router } from "express";
import Container from "typedi";
import SessionController from "../controllers/session.controller";
import validate from "../middlewares/validate.request";
import { createSessionSchema } from "../schemas/session.schemas";
import { tryCatch } from "../utils/errors/errors.utils";

const SessionRouter = Router();
const controller = Container.get(SessionController);

SessionRouter.post(
  "/login",
  validate(createSessionSchema),
  tryCatch(controller.createSession.bind(controller))
);

export default SessionRouter;
