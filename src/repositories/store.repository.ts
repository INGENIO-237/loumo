import { Service } from "typedi";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schemas";
import { Store, StoreDocument } from "../models/store.model";

@Service()
export default class StoreRepository {
  async getCurrentUserStores(user: string) {
    return await Store.find({ user }).select("-__v -updatedAt -user");
  }

  async getStore(storeId: string){
    return await Store.findById(storeId).select("-__v -updatedAt -user");
  }

  async createStore(store: CreateStoreInput) {
    return Store.create(store).then(async (createdStore) => {
      return await Store.findById<StoreDocument>(
        createdStore._id.toString()
      ).select("-__v");
    });
  }

  async updateStore(storeId: string, data: UpdateStoreInput) {
    await Store.findByIdAndUpdate(storeId, data);
  }
}
