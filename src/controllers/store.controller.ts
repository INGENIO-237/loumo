import { Request, Response } from "express";
import { Service } from "typedi";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schemas";
import StoreService from "../services/store.services";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class StoreController {
  constructor(private service: StoreService) {}

  async getCurrentUserStores(req: Request, res: Response) {
    const user = res.locals.user;

    const stores = await this.service.getCurrentUserStores(user);

    return res.status(HTTP.OK).json(stores);
  }

  async createStore(req: Request<{}, {}, CreateStoreInput>, res: Response) {
    req.body.user = res.locals.user;

    const store = await this.service.createStore(req.body);

    return res.status(HTTP.CREATED).json(store);
  }

  async updateStore(
    req: Request<{ storeId: string }, {}, UpdateStoreInput>,
    res: Response
  ) {
    await this.service.updateStore(req.params.storeId, req.body);

    return res.sendStatus(HTTP.OK);
  }
}
