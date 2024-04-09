import { Service } from "typedi";
import SessionRepository from "../repositories/session.repository";
import {
  CreateSessionInput,
  ForgotPasswordConfirmInput,
} from "../schemas/session.schemas";
import UserService from "./user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import { signJwt } from "../utils/jwt.utils";
import generateOtp from "../utils/otp";
import { UserDocument } from "../models/user.model";
import { UsersHooks } from "../hooks";
import { USER_HOOK_ACTIONS } from "../utils/constants/hooks.actions";

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
    // Will throw a 404 error if not found
    const user = await this.userService.getUser({ email });

    await this.otpSender(user);
  }

  async forgotPasswordConfirm({
    email,
    otp,
    password,
  }: ForgotPasswordConfirmInput["body"]) {
    const user = await this.userService.getUser({ email });

    if (user.otp !== otp)
      throw new ApiError(
        "Invalid OTP Code. Retry or ask for a new one",
        HTTP.BAD_REQUEST
      );

    await this.userService.updateUser(user._id.toString(), { password });
  }

  private async otpSender(user: UserDocument) {
    const otp = generateOtp();

    await this.userService.updateUser(user._id.toString(), { otp });

    UsersHooks.emit(USER_HOOK_ACTIONS.OTP_CODE, { receiver: user.email, otp });
  }
}
