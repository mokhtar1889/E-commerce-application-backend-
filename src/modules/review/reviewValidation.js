import joi from "joi";
import { Types } from "mongoose";

//add review
export let addReview = joi
  .object({
    rating: joi.number().required().min(1).max(5).required(),
    comment: joi.string(),
    productId: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid product id!");
      })
      .required(),
  })
  .required();

//update review
export let updateReview = joi
  .object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string(),
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid product id!");
      })
      .required(),
    productId: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid product id!");
      })
      .required(),
  })
  .required();
