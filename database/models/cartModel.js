import mongoose, { Schema, Types } from "mongoose";

let cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    user: { type: Types.ObjectId, ref: "User", unique: true, required: true },
  },
  {
    timestamps: true,
  }
);

export let Cart = mongoose.model("Cart", cartSchema);
