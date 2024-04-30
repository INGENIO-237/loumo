import { Service } from "typedi";
import CategoryService from "../services/category.services";
import { Request, Response } from "express";
import HTTP from "../utils/constants/http.responses";
import { CreateCategoryInput } from "../schemas/category.schemas";

@Service()
export default class CategoryController {
  constructor(private service: CategoryService) {}

  async getCategories(req: Request, res: Response) {
    const categories = await this.service.getCategories();

    return res.status(HTTP.OK).json(categories);
  }

  async createCategory(
    req: Request<{}, {}, CreateCategoryInput["body"]>,
    res: Response
  ) {
    const category = await this.service.createCategory(req.body);

    return res.status(HTTP.CREATED).json(category);
  }
}
