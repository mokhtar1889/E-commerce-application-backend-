import joi from "joi";

// signUp
export let signUpValidationSchema = joi
  .object({
    username: joi.string().alphanum().min(5).max(20).required(),

    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.string().valid("male", "female").required(),
    role: joi.string().valid("user", "seller", "admin").required(),
    phoneNumber: joi
      .string()
      .pattern(/^01[0-2,5]\d{8}$/)
      .required(),
  })
  .required();

// token
export let tokenValidationSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();

//signIn
export let signInValidationSchema = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

//forget Password
export let forgetPasswordValidationSchema = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

//reset password
export let resetPasswordValidationSchema = joi
  .object({
    email: joi.string().email().required(),
    resetCode: joi.string().length(5).required(),

    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
