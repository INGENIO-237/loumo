import { Service } from "typedi";
import StoreRepository from "../repositories/store.repository";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schemas";
import ApiError from "../utils/errors/errors.base";
import HTTP from "../utils/constants/http.responses";
import { v2 as cloudinary } from "cloudinary";
import { deleteImage } from "../utils/cloudinary.utils";

@Service()
export default class StoreService {
  constructor(private repository: StoreRepository) {}

  async getCurrentUserStores(user: string) {
    return await this.repository.getCurrentUserStores(user);
  }

  private async getStore(storeId: string) {
    const store = await this.repository.getStore(storeId);

    if (!store) throw new ApiError("Store Not Found", HTTP.NOT_FOUND);

    return store;
  }

  async createStore(store: CreateStoreInput) {
    return await this.repository.createStore(store);
  }

  async updateStore(storeId: string, data: UpdateStoreInput) {
    const store = await this.getStore(storeId);

    await this.repository.updateStore(store._id, data);

    if (data.logo && store.logo) await deleteImage(store.logo);

    if (data.bannerImage && store.bannerImage)
      await deleteImage(store.bannerImage);
  }
}
