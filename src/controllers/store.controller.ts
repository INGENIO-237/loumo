import { Request, Response } from "express";
import { Service } from "typedi";
import { CreateStoreInput } from "../schemas/store.schemas";
import StoreService from "../services/store.services";

@Service()
export default class StoreController {
  constructor(private service: StoreService) {}

  async createStore(
    req: Request<{}, {}, CreateStoreInput["body"]>,
    res: Response
  ) {
    console.log(req.body);

    return res.sendStatus(200)
  }
}
