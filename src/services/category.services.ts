import { Service } from "typedi";
import CategoryRepository from "../repositories/category.repository";
import { CreateCategoryInput } from "../schemas/category.schemas";

@Service()
export default class CategoryService {
  constructor(private repository: CategoryRepository) {}

  async getCategories(){
    return await this.repository.getCategories()
  }

  async createCategory(category: CreateCategoryInput["body"]){
    return await this.repository.createCategory(category)
  }
}
