import joi from "joi";
import { Types } from "mongoose";

//createCategorySchema
export let category = joi
  .object({
    name: joi.string().min(5).max(20).required(),
  })
  .required();

//updateCategory
export let updateCategory = joi.object({
  name: joi.string().min(5).max(20),
  id: joi
    .string()
    .custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid id");
    })
    .required(),
});

//deleteCategory
export let deleteCategory = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid id");
      })
      .required(),
  })
  .required();
