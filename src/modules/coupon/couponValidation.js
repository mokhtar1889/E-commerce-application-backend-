import joi from "joi";
import { Types } from "mongoose";

//createCoupon
export let createCoupon = joi
  .object({
    discount: joi.number().integer().min(1).max(100).required(),
    expiredAt: joi.date().greater(Date.now()).required(),
  })
  .required();

//update coupon
export let updateCoupon = joi
  .object({
    discount: joi.number().integer().min(1).max(100),
    expiredAt: joi.date().greater(Date.now()),
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid coupon id");
      })
      .required(),
  })
  .required();

//delete coupon
export let deleteCoupon = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid coupon id");
      })
      .required(),
  })
  .required();
