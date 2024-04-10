import { Request, Response } from "express";
import { Service } from "typedi";
import { CreateStoreInput } from "../schemas/store.schemas";
import StoreService from "../services/store.services";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class StoreController {
  constructor(private service: StoreService) {}

  async createStore(req: Request<{}, {}, CreateStoreInput>, res: Response) {
    req.body.user = res.locals.user;

    const store = await this.service.createStore(req.body);

    return res.status(HTTP.CREATED).json(store);
  }
}
