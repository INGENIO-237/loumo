import { Service } from "typedi";
import UserService from "../services/user.services";
import { Request, Response } from "express";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";

@Service()
export default class UserController {
  constructor(private service: UserService) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.service.getUsers();

    return res.status(200).json(users);
  }

  async createUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    const user = await this.service.createUser(req.body);

    return res.status(201).json(user);
  }

  async updateUser(
    req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
    res: Response
  ) {
    const { user } = req.params;
    await this.service.updateUser(user, req.body);

    return res.sendStatus(200);
  }
}
