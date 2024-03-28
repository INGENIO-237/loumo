import { Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../constants/http.responses";

@Service()
export default class UserService {
  constructor(private repository: UserRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
  }

  async getUser({ id, email }: { id?: string; email?: string }) {
    const user = await this.repository.getUser({ id, email });

    if (!user) throw new ApiError("User Not Found", HTTP.NOT_FOUND);

    return user;
  }

  async createUser(user: CreateUserInput["body"]) {
    return await this.repository.createUser(user);
  }

  async updateUser(
    userId: string,
    user:
      | UpdateUserInput["body"]
      | (UpdateUserInput["body"] & { isVerified?: boolean; otp?: number })
  ) {
    this.getUser({ id: userId });
    await this.repository.updateUser(userId, user);
  }
}
