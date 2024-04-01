import { Service } from "typedi";
import SessionRepository from "../repositories/session.repository";
import { CreateSessionInput } from "../schemas/session.schemas";
import UserService from "./user.services";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../constants/http.responses";

@Service()
export default class SessionService {
  constructor(
    private repository: SessionRepository,
    private userService: UserService
  ) {}

  async createSession({ email, password }: CreateSessionInput["body"]) {
    // Ensure if user's registered or not
    const user = await this.userService.getUser({ email });

    if (!user) throw new ApiError("User does not exist", HTTP.BAD_REQUEST);

    // Validate user's password
    const passwordIsCorrect = await user.comparePassword(password);

    if (!passwordIsCorrect)
      throw new ApiError("Incorrect password", HTTP.BAD_REQUEST);

    this.repository.createSession();
  }
}
