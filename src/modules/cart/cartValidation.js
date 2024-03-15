import joi from "joi";
import { Types } from "mongoose";

//addToCart
export let addToCart = joi
  .object({
    productId: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid product id");
      })
      .required(),
    quantity: joi.number().integer().min(1).required(),
  })
  .required();

//get user cart
export let getUserCart = joi
  .object({
    cartId: joi.string().custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid cart id");
    }),
  })
  .required();

//update cart
export let updateCart = joi
  .object({
    productId: joi.string().custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid product id");
    }),
    quantity: joi.number().integer().min(1),
  })
  .required();

//remove from cart
export let removeFromCart = joi
  .object({
    id: joi.string().custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid product id");
    }),
    quantity: joi.number().integer().min(1),
  })
  .required();
