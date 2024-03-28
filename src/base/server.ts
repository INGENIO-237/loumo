import express from "express";
import connectToDatabase from "./db";
import router from "../router";
import errorHandler from "../utils/errors/errors.handler";

export default function createServer() {
  const server = express();

  connectToDatabase();

  server.use(express.json());

  router(server);

  server.use(errorHandler);

  return server;
}
