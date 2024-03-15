import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";

let userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: [true, "email is already exists!"],
      lowercase: true,
    },
    password: { type: String, required: [true, "password is required"] },
    isActivated: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    phone: { type: String },
    profilePicture: { url: String, id: String },
    coverPicture: { url: String, id: String },
    resetCode: { type: Number },
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcryptjs.hashSync(
      this.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
});

export let User = mongoose.model("User", userSchema);
