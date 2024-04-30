import { Service } from "typedi";
import ProductRepository from "../repositories/product.repository";
import { CreateProductInput } from "../schemas/product.schemas";

@Service()
export default class ProductService {
  constructor(private repository: ProductRepository) {}

  async getProducts() {
    return await this.repository.getProducts();
  }

  async createProduct(product: CreateProductInput) {
    return await this.repository.createProduct(product);
  }
}
