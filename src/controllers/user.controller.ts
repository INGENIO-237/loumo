import { Service } from "typedi";
import UserService from "../services/user.services";
import { Request, Response } from "express";
import { CreateUserInput, UpdateUserInput } from "../schemas/user.schemas";
import HTTP from "../constants/http.responses";

@Service()
export default class UserController {
  constructor(private service: UserService) {}

  async getUsers(req: Request, res: Response) {
    const users = await this.service.getUsers();

    return res.status(HTTP.OK).json(users);
  }

  async createUser(
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) {
    const user = await this.service.createUser(req.body);

    return res.status(HTTP.CREATED).json(user);
  }

  async updateUser(
    req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
    res: Response
  ) {
    const { user } = req.params;
    await this.service.updateUser(user, req.body);

    return res.sendStatus(HTTP.OK);
  }
}
