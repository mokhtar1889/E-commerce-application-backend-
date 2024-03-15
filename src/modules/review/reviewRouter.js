import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authenticationMiddleware.js";
import { isAuthorized } from "../../middlewares/authorizationMiddleware.js";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as reviewControllers from "../review/reviewController.js";
import * as reviewValidation from "../review/reviewValidation.js";

let router = new Router({ mergeParams: true });

//add review
router.post(
  "/addReview",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewValidation.addReview),
  reviewControllers.addReview
);

//update review
router.patch(
  "/updateReview/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewValidation.updateReview),
  reviewControllers.updateReview
);

//update review

export default router;
