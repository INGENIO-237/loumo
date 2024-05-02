import { Service } from "typedi";
import ProductRepository from "../repositories/product.repository";
import { CreateProductInput, FilterProductsRule } from "../schemas/product.schemas";
import ApiError from "../utils/errors/errors.base";
import COMMON_MSG from "../utils/constants/common.msgs";
import HTTP from "../utils/constants/http.responses";

@Service()
export default class ProductService {
  constructor(private repository: ProductRepository) {}

  async getProducts(filter: FilterProductsRule["query"] = undefined) {
    return await this.repository.getProducts(filter);
  }

  async createProduct(product: CreateProductInput) {
    return await this.repository.createProduct(product);
  }

  async getProduct(productId: string, raiseException = true) {
    const product = await this.repository.getProduct(productId);

    if (!product && raiseException) {
      throw new ApiError(COMMON_MSG.notFound("Product"), HTTP.NOT_FOUND);
    }

    return product;
  }
}
