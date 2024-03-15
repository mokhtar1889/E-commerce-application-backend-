import { asyncHandler } from "./../../utile/asyncHandler.js";
import { Subcategory } from "./../../../database/models/subcategoryModel.js";
import cloudinary from "../../utile/cloudinary.js";
import { Category } from "../../../database/models/categoryModel.js";
import slugify from "slugify";

//create subcategory
export let createSubcategory = asyncHandler(async (req, res, next) => {
  //check file
  if (!req.file)
    return next(new Error("subcategory picture is missing!", { cause: 404 }));
  //check subcategory
  let subcategory = await Subcategory.findOne({ name: req.body.name });
  if (subcategory)
    return next(new Error("subcategory is already exists!", { cause: 400 }));

  //check category
  let category = await Category.findById(req.params.category);
  if (!category)
    return next(new Error("category is not exists!", { cause: 404 }));

  //upload picture to cloudinary
  let { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-Commerce/categories/subcategories`,
    }
  );

  //add subcategory to database
  let response = await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    subcategoryPicture: {
      id: public_id,
      url: secure_url,
    },
    category: req.params.category,
    createdBy: req.user._id,
  });

  res.json({
    success: true,
    message: "subcategory created successfully",
    subcategory: response,
  });
});

//update subcategory
export let updatesubcategory = asyncHandler(async (req, res, next) => {
  // date
  let { name } = req.body;
  let user = req.user;

  //check category
  let category = await Category.findById(req.params.category);
  if (!category)
    return next(new Error("category is not exists!", { cause: 404 }));

  // check the subcategory
  let subcategory = await Subcategory.findOne({ _id: req.params.id });
  if (!subcategory)
    return next(new Error("this subcategory is not exists!!", { cause: 404 }));

  //check if category is the parent of subcategory
  if (subcategory.category.toString() != category._id.toString())
    return next(
      new Error("category is not the parent of this subcategory", {
        cause: 400,
      })
    );

  // check subcategory owner
  if (user._id.toString() !== subcategory.createdBy.toString())
    return next(
      new Error("this user is not the owner of this subcategory", {
        cause: 401,
      })
    );

  // change the category name and slug if exists
  subcategory.name = name ? name : subcategory.name;
  subcategory.slug = name ? slugify(name) : subcategory.slug;
  await subcategory.save();

  //upload file in cloudinary if exists
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: subcategory.subcategoryPicture.id,
      }
    );
    subcategory.subcategoryPicture = {
      url: secure_url,
      id: public_id,
    };
    await subcategory.save();
  }

  return res.json({
    result: "success",
    message: "subcategory updated successfully",
  });
});

//delete category
export let deleteSubcategory = asyncHandler(async (req, res, next) => {
  //date
  let user = req.user;
  let { id } = req.params;

  //check category
  let category = await Category.findById(req.params.category);
  if (!category)
    return next(new Error("category is not exists!", { cause: 404 }));

  // check subcategory
  let subcategory = await Subcategory.findById(id);
  if (!subcategory)
    return next(new Error("subcategory is not exists!", { cause: 404 }));

  // check subcategory owner
  if (subcategory.createdBy.toString() !== user._id.toString())
    return next(
      new Error("this user is not the owner of the subcategory to delete it", {
        cause: 401,
      })
    );

  //check if category is the parent of subcategory
  if (subcategory.category.toString() != category._id.toString())
    return next(
      new Error("category is not the parent of this subcategory", {
        cause: 400,
      })
    );

  //delete category from database
  let response = await Subcategory.findByIdAndDelete(id);
  console.log(response);

  // delete category picture from database
  let cloudinaryResponse = await cloudinary.uploader.destroy(
    subcategory.subcategoryPicture.id
  );

  return res.json({
    success: true,
    message: "subcategory deleted successfully",
  });
});

//get all subcategories
export let getAllSubcategories = asyncHandler(async (req, res, next) => {
  //get all subcategories of certain category
  if (req.params.category) {
    //check category
    let category = await Category.findById(req.params.category);

    if (!category)
      return next(new Error("category is not exists!", { cause: 400 }));

    let subcategories = await Subcategory.find({
      category: req.params.category,
    }).populate([
      {
        path: "createdBy",
        select: "username email -_id",
      },
      {
        path: "category",
        select: "name -_id",
      },
    ]);

    if (subcategories.length == 0)
      return res.json({ message: "no subcategories exists!" });

    return res.json({
      success: true,
      numberOfsubcategories: `${subcategories.length}`,
      subcategories,
    });
  }

  //get all subcategories
  let subcategories = await Subcategory.find().populate([
    {
      path: "createdBy",
      select: "username email -_id",
    },
    {
      path: "category",
      select: "name -_id",
    },
  ]);

  if (subcategories.length == 0)
    return res.json({ message: "no subcategories exists!" });

  return res.json({
    success: true,
    numberOfsubcategories: `${subcategories.length}`,
    subcategories,
  });
});
