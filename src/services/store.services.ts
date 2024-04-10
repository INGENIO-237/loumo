import { Service } from "typedi";
import StoreRepository from "../repositories/store.repository";
import { CreateStoreInput } from "../schemas/store.schemas";

@Service()
export default class StoreService {
  constructor(private repository: StoreRepository) {}

  async createStore(store: CreateStoreInput) {
    return await this.repository.createStore(store);
  }
}
