import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { uploadFile } from "../../utile/multer.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as productControllers from "./productControllers.js";
import * as productValidation from "./productValidation.js";
import reviewRouter from "../review/reviewRouter.js";

let router = new Router();

router.use("/:productId/review", reviewRouter);

//create product
router.post(
  "/createProduct",
  isAuthenticated,
  isAuthorized("seller"),
  uploadFile().fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  validation(productValidation.createProduct),
  productControllers.createProduct
);

//delete product
router.delete(
  "/deleteProduct/:id",
  isAuthenticated,
  isAuthorized("seller", "admin"),
  validation(productValidation.deleteProduct),
  productControllers.deleteProduct
);

//get all products
router.get("/allProduct", productControllers.getProducts);

export default router;
