import { Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";

@Service()
export default class UserService {
  constructor(private repository: UserRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
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
    await this.repository.updateUser(userId, user);
  }
}
