import { Router } from "express";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as couponControllers from "./couponController.js";
import * as couponValidation from "./couponValidation.js";

let router = new Router();

//create coupon
router.post(
  "/createCoupon",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidation.createCoupon),
  couponControllers.createCoupon
);

//update coupon
router.patch(
  "/updatedCoupon/:id",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidation.updateCoupon),
  couponControllers.updateCoupon
);

//delete coupon
router.delete(
  "/deleteCoupon/:id",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponValidation.deleteCoupon),
  couponControllers.deleteCoupon
);

//get all coupons
router.get(
  "/getAllCoupons",
  isAuthenticated,
  isAuthorized("seller", "admin"),
  couponControllers.getAllCoupon
);

export default router;
