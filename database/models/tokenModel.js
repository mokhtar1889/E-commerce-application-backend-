import mongoose, { Schema, Types } from "mongoose";

let tokenSchema = new Schema(
  {
    token: { type: String, required: [true, "token is required !"] },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required !"],
    },
    isValid: { type: Boolean, default: true },
    agent: String,
    expiredAt: String,
  },
  { timestamps: true }
);

export let Token = mongoose.model("token", tokenSchema);
