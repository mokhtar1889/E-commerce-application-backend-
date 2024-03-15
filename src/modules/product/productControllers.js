import { asyncHandler } from "../../utile/asyncHandler.js";
import { Category } from "../../../database/models/categoryModel.js";
import { Subcategory } from "../../../database/models/subcategoryModel.js";
import { Brand } from "../../../database/models/brandModel.js";
import { Product } from "../../../database/models/productModel.js";
import cloudinary from "../../utile/cloudinary.js";
import { nanoid } from "nanoid";

//create product
export let createProduct = asyncHandler(async (req, res, next) => {
  //check category
  let category = await Category.findById(req.body.category);
  if (!category)
    return next(new Error("category is not exists!", { cause: 404 }));

  //check subcategory
  let subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("subcategory is not exists!", { cause: 404 }));

  //check brand
  let brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("brand is not exists!", { cause: 404 }));

  //check file
  if (!req.files)
    return next(new Error("product images is required!", { cause: 400 }));

  //create cloud folder
  let cloudFolder = nanoid();

  //upload images
  let images = [];
  for (let file of req.files.subImages) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `E-Commerce/products/${cloudFolder}`,
      }
    );
    images.push({ id: public_id, url: secure_url });
  }

  //upload default image
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    {
      folder: `E-Commerce/products/${cloudFolder}`,
    }
  );

  //create product
  let product = await Product.create({
    ...req.body,
    createdBy: req.user._id,
    cloudFolder,
    images,
    defaultImage: {
      id: public_id,
      url: secure_url,
    },
  });

  //response
  return res.json({
    success: true,
    message: "product created successfully",
    product,
  });
});

//delete product
export let deleteProduct = asyncHandler(async (req, res, next) => {
  //check product
  let product = await Product.findById(req.params.id);
  if (!product)
    return next(new Error("product is not exists!", { cause: 404 }));

  //check owner
  if (req.user.role == "seller") {
    if (product.createdBy.toString() != req.user._id)
      return next(
        new Error("only product owner can remove it", { cause: 401 })
      );
  }

  //delete product from database
  await product.deleteOne();

  // get images id
  let ids = product.images.map((image) => {
    return image.id;
  });

  //add default image to ids
  ids.push(product.defaultImage.id);

  //delete product from cloudinary
  await cloudinary.api.delete_resources(ids);

  //delete empty folder
  await cloudinary.api.delete_folder(
    `E-Commerce/products/${product.cloudFolder}`
  );

  //response
  return res.json({ success: true, message: "product deleted successfully" });
});

//get all products
export let getProducts = asyncHandler(async (req, res, next) => {
  let { page, keyword, sort, category, brand, subcategory } = req.query;

  //check category
  if (category) {
    if (!(await Category.findById(category)))
      return next(new Error("category is not exists!", { cause: 404 }));
  }

  //check brand
  if (brand) {
    if (!(await Brand.findById(brand)))
      return next(new Error("brand is not exists!", { cause: 404 }));
  }

  //check subcategory
  if (subcategory) {
    if (!(await Subcategory.findById(subcategory)))
      return next(new Error("subcategory is not exists!", { cause: 404 }));
  }

  let allProducts = await Product.find({ ...req.query })
    .sort(sort)
    .paginate(page)
    .search(keyword);

  if (allProducts.length == 0)
    return res.json({ message: "no products match your criteria" });

  return res.json({
    success: true,
    numberOfProducts: allProducts.length,
    products: allProducts,
  });
});
