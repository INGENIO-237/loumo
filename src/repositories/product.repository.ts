import { Service } from "typedi";
import Product from "../models/product.model";
import {
  CreateProductInput,
  FilterProductsRule,
} from "../schemas/product.schemas";
import { Types } from "mongoose";

@Service()
export default class ProductRepository {
  async getProducts(
    filter: FilterProductsRule["query"] = undefined,
    isAdmin = false
  ) {
    const total = await Product.countDocuments();
    let products;

    // Skip in case filter == {}
    if (isAdmin) {
      if (filter && Object.keys(filter).length > 0) {
        const { merchant, category, tags = [], page, perPage } = filter!;

        products = await Product.aggregate([
          {
            $match: {
              $or: [
                { merchant: new Types.ObjectId(merchant) },
                { category },
                { tags: { $in: tags } },
              ],
            },
          },
          { $skip: (Number(page) - 1) * Number(perPage) },
          { $limit: Number(perPage) },
          { $sort: { updatedAt: -1 } },
          // {
          //   $group: {
          //     _id: "$category",
          //     products: { $push: "$$ROOT" },
          //   },
          // },
        ]);
      } else {
        products = await Product.find()
          .populate([
            { path: "merchant", select: "email" },
            { path: "category", select: "title -_id" },
          ])
          .sort({ updatedAt: -1 });
      }
    } else {
      if (filter && Object.keys(filter).length > 0) {
        const { merchant, category, tags = [], page, perPage } = filter!;

        products = await Product.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    { merchant: new Types.ObjectId(merchant) },
                    { category },
                    { tags: { $in: tags } },
                  ],
                },
                { hasBeenDeleted: false },
              ],
            },
          },
          { $skip: (Number(page) - 1) * Number(perPage) },
          { $limit: Number(perPage) },
          { $sort: { updatedAt: -1 } },
          // {
          //   $group: {
          //     _id: "$category",
          //     products: { $push: "$$ROOT" },
          //   },
          // },
        ]);
      } else {
        products = await Product.find({ hasBeenDeleted: false })
          .populate([
            { path: "merchant", select: "email" },
            { path: "category", select: "title -_id" },
          ])
          .sort({ updatedAt: -1 });
      }
    }

    return { total, products };
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

  async deleteProduct(productId: string) {
    /**
     * TODO: Look for orders related to the given product.
     * If any, soft delete.
     * Otherwise, completely remove product
     */

    await Product.findByIdAndUpdate(productId, {
      hasBeenDeleted: true,
      mainImage: {
        url: "",
        publicId: "",
      },
      additionals: [],
    });
  }
}
