import { Service } from "typedi";
import { CreateStoreInput } from "../schemas/store.schemas";
import { Store, StoreDocument } from "../models/store.model";

@Service()
export default class StoreRepository {
  async createStore(store: CreateStoreInput["body"] & { user: string }) {
    return Store.create(store).then(async (createdStore) => {
      return await Store.findById<StoreDocument>(createdStore._id.toString()).select("-__v");
    });
  }
}
