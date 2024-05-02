import { Service } from "typedi";
import Product from "../models/product.model";
import {
  CreateProductInput,
  FilterProductsRule,
} from "../schemas/product.schemas";
import { Types } from "mongoose";

@Service()
export default class ProductRepository {
  async getProducts(filter: FilterProductsRule["query"] = undefined) {
    const { merchant, category, tags } = filter!;

    if (merchant || category || tags) {
      return await Product.aggregate([
        {
          $match: {
            $or: [
              { merchant: new Types.ObjectId(merchant) },
              { category: category },
            ],
          },
        },
        // {
        //   $group: {
        //     _id: "$category",
        //   },
        // },
      ]);

      // return await Product.find({
      //   $or: [{ merchant }, { category }, { tags: { $in: tags } }],
      // });
    }

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
