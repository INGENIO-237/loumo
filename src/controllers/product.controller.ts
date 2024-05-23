import { Request, Response } from "express";
import ProductService from "../services/product.services";
import {
  CreateProductInput,
  FilterProductsRule,
  GetProductRule,
} from "../schemas/product.schemas";
import HTTP from "../utils/constants/http.responses";
import { Service } from "typedi";

@Service()
export default class ProductController {
  constructor(private service: ProductService) {}

  async getProducts(
    req: Request<{}, {}, {}, FilterProductsRule["query"]>,
    res: Response
  ) {
    const products = await this.service.getProducts(req.query);

    return res.status(HTTP.OK).json(products);
  }

  async createProduct(req: Request<{}, {}, CreateProductInput>, res: Response) {
    const product = await this.service.createProduct(req.body);

    return res.status(HTTP.CREATED).json(product);
  }

  async getProduct(req: Request<GetProductRule["params"]>, res: Response) {
    const product = await this.service.getProduct(req.params.product);

    return res.status(HTTP.OK).json(product);
  }

  async getStore(req: Request, res: Response) {
    const products = await this.service.getProducts({
      ...req.query,
      merchant: res.locals.user,
    });

    return res.status(HTTP.OK).json(products);
  }

  async deleteProduct(req: Request<{ product: string }>, res: Response) {
    await this.service.deleteProduct(
      req.params.product,
      res.locals.user as string
    );

    return res.sendStatus(HTTP.OK);
  }
}
