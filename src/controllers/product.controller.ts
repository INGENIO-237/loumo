import { Request, Response } from "express";
import ProductService from "../services/product.services";
import { CreateProductInput } from "../schemas/product.schemas";
import HTTP from "../utils/constants/http.responses";
import { Service } from "typedi";

@Service()
export default class ProductController {
  constructor(private service: ProductService) {}

  async getProducts(req: Request, res: Response) {
    const products = await this.service.getProducts();

    return res.status(HTTP.OK).json(products);
  }

  async createProduct(req: Request<{}, {}, CreateProductInput>, res: Response) {
    const product = await this.service.createProduct(req.body);

    return res.status(HTTP.CREATED).json(product);
  }
}
