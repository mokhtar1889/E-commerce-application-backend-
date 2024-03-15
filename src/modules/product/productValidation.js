import joi from "joi";
import { Types } from "mongoose";

//create product
export let createProduct = joi
  .object({
    name: joi.string().required().min(2).max(20),
    description: joi.string().min(10).max(200),
    availableItems: joi.number().min(1).required(),
    price: joi.number().integer().min(1).required(),
    discount: joi.number().min(1).max(100),
    category: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid category id");
      })
      .required(),
    subcategory: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid subcategory id");
      })
      .required(),
    brand: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid brand id");
      })
      .required(),
  })
  .required();

//delete product
export let deleteProduct = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid product id");
      })
      .required(),
  })
  .required();
