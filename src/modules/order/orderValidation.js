import joi from "joi";
import { Types } from "mongoose";

//create order
export let createOrder = joi
  .object({
    phone: joi.string().required(),
    address: joi.string().required(),
    payment: joi.string().valid("cash", "visa").required(),
    coupon: joi.string().length(5),
  })
  .required();

export let cancelOrder = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid order id");
      })
      .required(),
  })
  .required();
