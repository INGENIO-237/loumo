import { Document, Schema, Types, model } from "mongoose";
import { CategoryDocument } from "./category.model";
import { CloudinaryResource } from "../types/product.types";

export interface ProductDocument extends Document {
  name: string;
  category: CategoryDocument["_id"];
  tags?: string[];
  price: number;
  characteristics?: string[];
  mainImage: CloudinaryResource;
  additionals?: CloudinaryResource[];
}

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: Types.ObjectId,
    ref: "Category",
  },
  tags: { type: [String], required: false },
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
});

const Product = model("Product", productSchema);

export default Product;
