import { Document, Schema, Types, model } from "mongoose";
import { UserDocument } from "./user.model";
import { CloudinaryResource } from "../types/product.types";

export interface StoreDocument extends Document {
  user: UserDocument["_id"];
  name: string;
  logo: CloudinaryResource;
  bannerImage: CloudinaryResource;
  createdAt: Date;
  updateAt: Date;
}

const storeSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    },
    bannerImage: {
      type: {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

export const Store = model<StoreDocument>("Store", storeSchema);
