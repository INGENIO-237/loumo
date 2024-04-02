import express from "express";
import connectToDatabase from "./db";
import router from "../router";
import errorHandler from "../utils/errors/errors.handler";
import { deserializeUser } from "../middlewares/session";

export default function createServer() {
  const server = express();

  connectToDatabase();

  server.use(express.json());
  server.use(deserializeUser);

  router(server);

  server.use(errorHandler);

  return server;
}
