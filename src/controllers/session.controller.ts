import { Service } from "typedi";
import SessionService from "../services/session.services";
import { Request, Response } from "express";
import { CreateSessionInput } from "../schemas/session.schemas";
import UserService from "../services/user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../constants/http.responses";

@Service()
export default class SessionController {
  constructor(
    private service: SessionService,
    private userService: UserService
  ) {}

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

  async getCurrentUser(req: Request, res: Response) {
    const user = await this.userService.getUser({ id: res.locals.user });
    
    if (!user) throw new ApiError("User not found", HTTP.NOT_FOUND);

    return res.status(HTTP.OK).json(user);
  }
}
