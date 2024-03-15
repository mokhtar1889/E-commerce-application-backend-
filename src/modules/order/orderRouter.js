import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import { uploadFile } from "../../utile/multer.js";
import * as orderControllers from "./orderController.js";
import * as orderValidation from "./orderValidation.js";

let router = new Router();

//create Order
router.post(
  "/createOrder",
  isAuthenticated,
  isAuthorized("user"),
  uploadFile().single("invoice"),
  validation(orderValidation.createOrder),
  orderControllers.createOrder
);

//cancel order
router.patch(
  "/cancelOrder/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(orderValidation.cancelOrder),
  orderControllers.cancelOrder
);

export default router;
