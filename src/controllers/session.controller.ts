import { Service } from "typedi";
import SessionService from "../services/session.services";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/session.schemas";

@Service()
export default class SessionController {
  constructor(private service: SessionService) {}

  async createSession(
    req: Request<{}, {}, CreateSessionInput["body"]>,
    res: Response
  ) {
    const { email, password } = req.body;
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || "";

    const { accessToken, refreshToken } = await this.service.createSession({
      email,
      password,
      userAgent,
      ip,
    });

    return res.status(201).json({ accessToken, refreshToken });
  }
}
