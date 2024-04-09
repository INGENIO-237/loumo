import { Request, Response } from "express";
import { Service } from "typedi";
import { CreateStoreInput } from "../schemas/store.schemas";

@Service()
export default class StoreController {
  async createStore(
    req: Request<{}, {}, CreateStoreInput["body"]>,
    res: Response
  ) {
    
  }
}
