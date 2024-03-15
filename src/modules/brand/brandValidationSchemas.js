import joi from "joi";
import { Types } from "mongoose";

//create brand
export let createBrand = joi
  .object({
    name: joi.string().required().max(20).min(3),
    categories: joi.array().items(
      joi
        .string()
        .custom((value, helper) => {
          if (Types.ObjectId.isValid(value)) return true;
          return helper.message("invalid category id");
        })
        .required()
    ),
  })
  .required();

//updateBrand
export let updateBrand = joi
  .object({
    name: joi.string().max(20).min(3),
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid category id");
      })
      .required(),
  })
  .required();

export let deleteBrand = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid category id");
      })
      .required(),
  })
  .required();
