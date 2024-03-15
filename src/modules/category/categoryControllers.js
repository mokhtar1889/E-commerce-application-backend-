import { asyncHandler } from "../../utile/asyncHandler.js";
import { Category } from "./../../../database/models/categoryModel.js";
import slugify from "slugify";
import cloudinary from "./../../utile/cloudinary.js";

//createCategory
export let createCategory = asyncHandler(async (req, res, next) => {
  // data from body
  let { name } = req.body;
  // get user from request
  let user = req.user;

  // check file
  if (!req.file)
    return next(new Error("category picture is missing!", { cause: 404 }));

  // check category
  let category = await Category.findOne({ name });
  if (category)
    return next(new Error("category is already exists!", { cause: 401 }));

  // add category picture to database
  let { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce/categories`,
    }
  );

  // add category to database
  let response = await Category.create({
    name,
    slug: slugify(name),
    categoryPicture: {
      id: public_id,
      url: secure_url,
    },
    createdBy: user._id,
  });

  if (!response) return next(new Error("user is not added to database!"));

  // api response
  res.json({ success: true, message: "category created successfully" });
});

//updateCategory
export let updateCategory = asyncHandler(async (req, res, next) => {
  // date
  let { name } = req.body;
  let user = req.user;

  // check the category
  let category = await Category.findOne({ _id: req.params.id });
  if (!category)
    return next(new Error("this category is not exists!!", { cause: 404 }));

  // check category owner
  if (user._id.toString() !== category.createdBy.toString())
    return next(
      new Error("this user is not the owner of this category", { cause: 401 })
    );

  // change the category name and slug if exists
  category.name = name ? name : category.name;
  category.slug = name ? slugify(name) : category.slug;
  await category.save();

  //upload file in cloudinary if exists
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.categoryPicture.id,
      }
    );
    category.categoryPicture = {
      url: secure_url,
      id: public_id,
    };
    await category.save();
  }

  return res.json({
    result: "success",
    message: "category updated successfully",
  });
});

//deleteCategory
export let deleteCategory = asyncHandler(async (req, res, next) => {
  //date
  let user = req.user;
  let { id } = req.params;

  // check category
  let category = await Category.findById(id);
  if (!category)
    return next(new Error("category is not exists!", { cause: 404 }));

  // check category owner
  if (category.createdBy.toString() !== user._id.toString())
    return next(
      new Error("this user is not the owner of the category to delete it", {
        cause: 401,
      })
    );

  //delete category from database
  await category.deleteOne();

  // delete category picture from database
  await cloudinary.uploader.destroy(category.categoryPicture.id);

  return res.json({ success: true, message: "category deleted successfully" });
});

//get all categories
export let getAllCategories = asyncHandler(async (req, res, next) => {
  let categories = await Category.find().populate({
    path: "createdBy",
    select: "username email -_id",
  });
  if (categories.length == 0)
    return res.json({ success: true, message: "no categories exists!" });

  return res.json({
    success: true,
    numberOfCategories: `${categories.length}`,
    categories,
  });
});
