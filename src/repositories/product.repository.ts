import { Service } from "typedi";
import Product from "../models/product.model";
import { CreateProductInput } from "../schemas/product.schemas";

@Service()
export default class ProductRepository {
  async getProducts() {
    return await Product.find().populate([
      { path: "merchant", select: "email" },
      { path: "category", select: "title -_id" },
    ]);
  }

  async createProduct(product: CreateProductInput) {
    return await Product.create(product);
  }

  async getProduct(productId: string) {
    return await Product.findById(productId).populate([
      { path: "merchant", select: "email" },
      { path: "category", select: "title -_id" },
    ]);
  }
}
