import { Router } from "express";
import { validation } from "../../middlewares/validationMiddleware.js";
import * as authControllers from "./authControllers.js";
import * as authValidationSchemas from "./authValidationSchemas.js";

const router = new Router();

//signUp
router.post(
  "/signUp",
  validation(authValidationSchemas.signUpValidationSchema),
  authControllers.signUp
);

//activate account
router.get(
  "/activateAccount/:token",
  validation(authValidationSchemas.tokenValidationSchema),
  authControllers.activateAccount
);

//signIn
router.post(
  "/signIn",
  validation(authValidationSchemas.signInValidationSchema),
  authControllers.signIn
);

//forgtePassword
router.post(
  "/forgetPassword",
  validation(authValidationSchemas.forgetPasswordValidationSchema),
  authControllers.forgetPassword
);

//reset password
router.post(
  "/resetPassword",
  validation(authValidationSchemas.resetPasswordValidationSchema),
  authControllers.resetPassword
);

export default router;
