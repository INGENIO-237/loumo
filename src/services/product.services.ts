import { Service } from "typedi";
import ProductRepository from "../repositories/product.repository";
import {
  CreateProductInput,
  FilterProductsRule,
} from "../schemas/product.schemas";
import ApiError from "../utils/errors/errors.base";
import COMMON_MSG from "../utils/constants/common.msgs";
import HTTP from "../utils/constants/http.responses";
import { ProductDocument } from "../models/product.model";
import { deleteCloudinaryResource } from "../utils/cloudinary.utils";

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

  async deleteProduct(productId: string, merchant: string) {
    const product = await this.getProduct(productId);

    await this.ownsProduct(merchant, product as ProductDocument);

    await this.repository.deleteProduct(product!._id.toString());

    await deleteCloudinaryResource(product!.mainImage);

    product!.additionals?.forEach(async (image) => {
      await deleteCloudinaryResource(image);
    });
  }

  private async ownsProduct(merchant: string, product: ProductDocument) {
    const isOwner = merchant === product.merchant.id.toString();

    if (!isOwner) {
      throw new ApiError(
        "Unauthorized to perform this action. You don't own this product.",
        HTTP.FORBIDDEN
      );
    }
  }
}
