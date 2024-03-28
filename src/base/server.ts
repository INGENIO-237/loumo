import express from "express";
import connectToDatabase from "./db";
import router from "../router";

export default function createServer() {
  const server = express();

  connectToDatabase();

  server.use(express.json());

  router(server);

  return server;
}
