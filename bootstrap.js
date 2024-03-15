import express from "express";
import { connectDatabase } from "./database/connection.js";
import { globalErrorsHandler } from "./src/utile/globalErrorsHandler.js";
import { notFoundPageHandler } from "./src/utile/notFoundPageHandler.js";
import authRouters from "./src/modules/auth/authRouters.js";
import categoryRouters from "./src/modules/category/categoryRouters.js";
import subcategoryRouters from "./src/modules/subcategory/subcategoryRouters.js";
import brandRouters from "./src/modules/brand/brandRouters.js";
import couponRouters from "./src/modules/coupon/couponRouter.js";
import productRouters from "./src/modules/product/productsRouters.js";
import cartRouter from "./src/modules/cart/cartRouter.js";
import orderRouter from "./src/modules/order/orderRouter.js";

export let bootstrap = async (app) => {
  await connectDatabase();
  app.use(express.json());
  app.use("/auth", authRouters);
  app.use("/category", categoryRouters);
  app.use("/subcategory", subcategoryRouters);
  app.use("/brand", brandRouters);
  app.use("/coupon", couponRouters);
  app.use("/product", productRouters);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.all("*", notFoundPageHandler);
  app.use(globalErrorsHandler);
};
