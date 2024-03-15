import mongoose, { Schema, Types } from "mongoose";

let reviewSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    product: { type: Types.ObjectId, ref: "Product", required: true },
    order: { type: Types.ObjectId, ref: "Order", required: true },
  },
  {
    timestamps: true,
  }
);

export let Review = mongoose.model("Review", reviewSchema);
