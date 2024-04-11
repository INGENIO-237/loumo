import { Document, Schema, Types, model } from "mongoose";
import { UserDocument } from "./user.model";

export type CloudinaryImage = {
  url: string;
  publicId: string;
}

export interface StoreDocument extends Document {
  user: UserDocument["_id"];
  name: string;
  logo: CloudinaryImage;
  bannerImage: CloudinaryImage;
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
