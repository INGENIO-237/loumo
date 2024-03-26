import { Express, Request, Response } from "express";
import UsersRouter from "./routes/user.routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  //   API endpoints
  server.use("/api/users", UsersRouter);
}
