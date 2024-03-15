import { Schema, Types, model } from "mongoose";

let couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, require: true, min: 1, max: 100 },
    expiredAt: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export let Coupon = model("Coupon", couponSchema);
