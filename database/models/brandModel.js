import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

let brandSchema = new Schema(
  {
    name: { type: String, unique: true, required: true, min: 3, max: 20 },
    slug: { type: String, unique: true, required: true },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export let Brand = mongoose.model("Brand", brandSchema);
