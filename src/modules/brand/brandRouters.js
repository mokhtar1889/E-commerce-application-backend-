import { Router } from "express";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as brandValidation from "./brandValidationSchemas.js";
import * as brandControllers from "./brandControllers.js";
import { uploadFile } from "./../../utile/multer.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";

let router = new Router();

//create brand
router.post(
  "/createBrand",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("brand"),
  validation(brandValidation.createBrand),
  brandControllers.createBrand
);

//updateBrand
router.patch(
  "/updateBrand/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("brand"),
  validation(brandValidation.updateBrand),
  brandControllers.updateBrand
);

//delete brand
router.delete(
  "/deleteBrand/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandValidation.deleteBrand),
  brandControllers.deleteBrand
);

//get all brands
router.get("/getAllBrands", brandControllers.getAllBrands);

export default router;
