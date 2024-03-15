import mongoose, { Schema, Types } from "mongoose";

let subcategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, max: 20 },
    slug: { type: String, required: true },
    subcategoryPicture: { id: String, url: String },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    brands: [{ type: Types.ObjectId, ref: "Brand" }],
  },
  {
    timestamps: true,
  }
);

export let Subcategory = mongoose.model("Subcategory", subcategorySchema);
