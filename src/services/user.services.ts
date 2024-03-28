import { Service } from "typedi";
import UserRepository from "../repositories/user.repository";
import { CreateUserInput } from "../schemas/user.schemas";

@Service()
export default class UserService {
  constructor(private repository: UserRepository) {}

  async getUsers() {
    return await this.repository.getUsers();
  }

  async createUser(user: CreateUserInput["body"]){
    return await this.repository.createUser(user)
  }
}
