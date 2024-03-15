import { asyncHandler } from "../../utile/asyncHandler.js";
import { Category } from "../../../database/models/categoryModel.js";
import cloudinary from "../../utile/cloudinary.js";
import { Brand } from "../../../database/models/brandModel.js";
import slugify from "slugify";

//create brand
export let createBrand = asyncHandler(async (req, res, next) => {
  let { categories, name } = req.body;
  //check categories
  categories.forEach(async (element) => {
    let category = await Category.findById(element);
    if (!category)
      return next(new Error("category is not exists!", { cause: 404 }));
  });

  //check brand
  let isBrandExists = await Brand.findOne({ name });
  if (isBrandExists)
    return next(new Error("brand is already exists!", { cause: 400 }));

  //check file
  if (!req.file) return next(new Error("picture is required", { cause: 400 }));

  //upload file to cloudinary
  let { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "E-Commerce/brand",
    }
  );

  //save brand in database
  let brand = await Brand.create({
    name,
    slug: slugify(name),
    image: {
      url: secure_url,
      id: public_id,
    },
    createdBy: req.user._id,
  });
  //save brands in each categories
  categories.forEach(async (element) => {
    await Category.findByIdAndUpdate(element, {
      $push: { brands: brand._id },
    });
  });
  //response
  return res.json({
    success: true,
    message: "brand added successfully",
    brand,
  });
});

//update brand
export let updateBrand = asyncHandler(async (req, res, next) => {
  //check brand
  let brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("barnd is not exists!", { cause: 404 }));

  //check file
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.image.id,
      }
    );
    brand.image = { url: secure_url, id: public_id };
  }

  brand.name = req.body.name ? req.body.name : brand.name;
  brand.slug = req.body.name ? slugify(req.body.name) : brand.name;

  await brand.save();

  return res.json({ success: true, message: "brand updated successfully" });
});

//delete brand
export let deleteBrand = asyncHandler(async (req, res, next) => {
  //check brand
  let brand = await Brand.findById(req.params.id);
  if (!brand) return next(new Error("barnd is not exists!", { cause: 404 }));

  //delet brand
  await Brand.findByIdAndDelete(req.params.id);

  //delete image
  await cloudinary.uploader.destroy(brand.image.id);

  //delete brand from categories
  await Category.updateMany({}, { $pull: { brands: req.params.id } });

  //response
  return res.json({ success: true, message: "brand deleted sucessfully" });
});

//get all brands
export let getAllBrands = asyncHandler(async (req, res, next) => {
  let brands = await Brand.find();
  res.json({ success: true, brands });
});
