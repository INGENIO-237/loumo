import { Service } from "typedi";
import User from "../models/user.model";

@Service()
export default class UserRepository {
  async getUsers() {
    return await User.find();
  }
}
