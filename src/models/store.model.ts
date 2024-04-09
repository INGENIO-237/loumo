import { Document, Schema, Types, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface StoreDocument extends Document {
  user: UserDocument["_id"];
  name: string;
  logo: string;
  bannerImage: string;
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
    logo: String,
    bannerImage: String,
  },
  { timestamps: true }
);

export const Store = model<StoreDocument>("Store", storeSchema);
