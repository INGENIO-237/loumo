import { Service } from "typedi";
import UserService from "../services/user.services";
import { Request, Response } from "express";

@Service()
export default class UserController {
  constructor(private service: UserService) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.service.getUsers();

    return res.status(200).json(users);
  }
}
