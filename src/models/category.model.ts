import { Document, Schema, model } from "mongoose";

export interface CategoryDocument extends Document {
  title: string;
  tags: string[];
}

const categorySchema = new Schema({
  title: { type: String, required: true },
  tags: { type: [String], required: false },
});

const Category = model("Category", categorySchema);
