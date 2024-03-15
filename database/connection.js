import mongoose from "mongoose";

export async function connectDatabase() {
  return await mongoose
    .connect(process.env.DATABASE_CONNECTION)
    .then(() => console.log("database connected"))
    .catch((error) => console.log("error in connection", error.message));
}
