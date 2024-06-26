import { Document, Schema, Types, model } from "mongoose";
import { CategoryDocument } from "./category.model";
import { CloudinaryResource } from "../types/product.types";
import { UserDocument } from "./user.model";

export interface ProductDocument extends Document {
  merchant: UserDocument["_id"];
  name: string;
  category: CategoryDocument["_id"];
  tags?: string[] | [];
  price: number;
  characteristics?: string[];
  mainImage: CloudinaryResource;
  additionals?: CloudinaryResource[];
  hasBeenDeleted: boolean;
}

const productSchema = new Schema(
  {
    merchant: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: { type: [String], default: [] },
    price: { type: Number, required: true },
    characteristics: { type: [String], required: false },
    mainImage: {
      type: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
      required: true,
    },
    additionals: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      required: false,
    },
    hasBeenDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.post<ProductDocument>(
  "find",
  function (result: ProductDocument[], next) {
    result = result.map((product) => {
      return {
        ...product,
        category: product.category.title,
      } as ProductDocument;
    });

    next();
  }
);

productSchema.post<ProductDocument>(
  "findOne",
  function (result: ProductDocument, next) {
    if (result)
      result = {
        ...result,
        category: result.category.title,
      } as ProductDocument;

    next();
  }
);

const Product = model<ProductDocument>("Product", productSchema);

export default Product;
