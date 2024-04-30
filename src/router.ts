import { Express, Request, Response } from "express";
import UsersRouter from "./routes/user.routes";
import SessionRouter from "./routes/session.routes";
import StoreRouter from "./routes/store.routes";
import CategoryRouter from "./routes/category.routes";
import ProductRouter from "./routes/product.routes";

export default function router(server: Express) {
  // Healthcheck endpoint
  server.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
  );

  //   API endpoints
  server.use("/api/users", UsersRouter);
  server.use("/api/sessions", SessionRouter);
  server.use("/api/stores", StoreRouter);
  server.use("/api/categories", CategoryRouter);
  server.use("/api/products", ProductRouter);
}
