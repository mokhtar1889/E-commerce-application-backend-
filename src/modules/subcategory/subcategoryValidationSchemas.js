import joi from "joi";
import { Types } from "mongoose";

//create subcategory Schema
export let subcategory = joi
  .object({
    name: joi.string().max(20).required(),
    category: joi.string().custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid Id");
    }),
  })
  .required();

//updateCategory
export let updatesubcategory = joi.object({
  name: joi.string().max(20),
  id: joi
    .string()
    .custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid id");
    })
    .required(),
  category: joi
    .string()
    .custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid id");
    })
    .required(),
});

//deleteSubcategory
export let deleteSubcategory = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid id");
      })
      .required(),
    category: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid id");
      })
      .required(),
  })
  .required();

//get all subcategories
export let getAllSubcategories = joi.object({
  category: joi.string().custom((value, helper) => {
    if (Types.ObjectId.isValid(value)) return true;
    return helper.message("invalid id");
  }),
});
