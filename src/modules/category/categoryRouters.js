import { Router } from "express";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { uploadFile } from "./../../utile/multer.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import subcategoryRouters from "./../subcategory/subcategoryRouters.js";
import * as categoryValidationSchemas from "./categoryValidationSchemas.js";
import * as categoryControllers from "./categoryControllers.js";

let router = new Router();

router.use("/:category/subcategory", subcategoryRouters);

//create category
router.post(
  "/createCategory",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("category"),
  validation(categoryValidationSchemas.category),
  categoryControllers.createCategory
);

//update category
router.patch(
  "/updateCategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadFile().single("category"),
  validation(categoryValidationSchemas.updateCategory),
  categoryControllers.updateCategory
);

//delete category
router.delete(
  "/deleteCategory/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(categoryValidationSchemas.deleteCategory),
  categoryControllers.deleteCategory
);

//get all categories
router.get("/getAllCategories", categoryControllers.getAllCategories);

export default router;
