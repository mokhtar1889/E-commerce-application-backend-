import { Router } from "express";
import * as subcategoryValidation from "./subcategoryValidationSchemas.js";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import { uploadFile } from "../../utile/multer.js";
import * as subcategoryControllers from "./subcategoryControllers.js";

let router = Router({ mergeParams: true });

//create subcategory
router.post(
  "/createSubcategory",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("subcategory"),
  validation(subcategoryValidation.subcategory),
  subcategoryControllers.createSubcategory
);

//update subcategory
router.patch(
  "/updatesubcategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("subcategory"),
  validation(subcategoryValidation.updatesubcategory),
  subcategoryControllers.updatesubcategory
);

//delete subcategory
router.delete(
  "/deleteSubcategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(subcategoryValidation.deleteSubcategory),
  subcategoryControllers.deleteSubcategory
);

//get all subcategories
router.get(
  "/getAllSubcategories",
  validation(subcategoryValidation.getAllSubcategories),
  subcategoryControllers.getAllSubcategories
);

export default router;
