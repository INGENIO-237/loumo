import { Service } from "typedi";
import SessionRepository from "../repositories/session.repository";
import { CreateSessionInput } from "../schemas/session.schemas";
import UserService from "./user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../constants/http.responses";
import { signJwt } from "../utils/jwt.utils";

@Service()
export default class SessionService {
  constructor(
    private repository: SessionRepository,
    private userService: UserService
  ) {}

  async createSession({
    email,
    password,
    userAgent,
    ip,
  }: CreateSessionInput["body"] & { userAgent: string; ip: string }) {
    // Ensure if user's registered or not
    const user = await this.userService.getUser({ email });

    // Validate user's password
    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect)
      throw new ApiError("Incorrect password", HTTP.BAD_REQUEST);

    const session = await this.repository.createSession({
      user: user._id,
      userAgent,
      ip,
    });

    // Sign session (Access token & Refresh token)
    const accessToken = signJwt(session);
    const refreshToken = signJwt(session, true);

    // Return back tokens
    return { accessToken, refreshToken };
  }

  async forgotPassword({ email }: { email: string }) {
    const user = await this.userService.getUser({ email });
  }
}
