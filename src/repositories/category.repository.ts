import { Service } from "typedi";
import Category from "../models/category.model";
import { CreateCategoryInput } from "../schemas/category.schemas";

@Service()
export default class CategoryRepository {
  async getCategories() {
    return await Category.find();
  }

  async createCategory(category: CreateCategoryInput["body"]) {
    return await Category.create(category);
  }

  async getCategory(catId: string) {
    return await Category.findById(catId);
  }
}
