import { Schema, Types, model } from "mongoose";
import { Subcategory } from "./subcategoryModel.js";

let categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, min: 5, max: 20 },
    slug: { type: String, required: true, unique: true },
    categoryPicture: { id: String, url: String },
    createdBy: { type: Types.ObjectId, ref: "User" },
    brands: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  {
    timestamps: true,
  }
);

categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await Subcategory.deleteMany({
      category: this._id,
    });
  }
);

export let Category = model("Category", categorySchema);
