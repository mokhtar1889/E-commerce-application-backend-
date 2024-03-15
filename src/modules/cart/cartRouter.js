import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import * as cartValidation from "./cartValidation.js";
import * as cartControllers from "./cartController.js";
import { validation } from "../../middlewares/validationmiddleware.js";

let router = new Router();

//add to cart
router.post(
  "/addToCart",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidation.addToCart),
  cartControllers.addToCart
);

//get user cart
router.get(
  "/getUserCart",
  isAuthenticated,
  isAuthorized("user", "admin"),
  validation(cartValidation.getUserCart),
  cartControllers.getUserCart
);

//update cart
router.patch(
  "/updateCart",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidation.updateCart),
  cartControllers.updateCart
);

//remove from cart
router.patch(
  "/removeFromCart/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(cartValidation.removeFromCart),
  cartControllers.removeFromCart
);

//clear cart
router.put(
  "/clearCart",
  isAuthenticated,
  isAuthorized("user"),
  cartControllers.clearCart
);

export default router;
