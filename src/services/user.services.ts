import { Service } from "typedi";
import UserRepository from "../repositories/user.repository";

@Service()
export default class UserService {
  constructor(private repository: UserRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
  }
}
