import { asyncHandler } from "../../utile/asyncHandler.js";
import { Order } from "../../../database/models/orderModel.js";
import { Review } from "../../../database/models/reviewModel.js";
import { Product } from "../../../database/models/productModel.js";

//add review
export let addReview = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  let { rating, comment } = req.body;

  //check product in orders
  let order = await Order.findOne({
    user: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });

  if (!order)
    return next(
      new Error("product must be delivered to review it!", { cause: 400 })
    );

  //check review
  let review = await Review.findOne({ user: req.user._id, product: productId });
  if (review)
    return next(new Error("this product is reviewed before", { cuase: 400 }));

  //add review to database
  await Review.create({
    rating,
    comment,
    user: req.user._id,
    product: req.params.productId,
    order: order._id,
  });

  //calculate average rate
  let average = 0;
  let product = await Product.findById(productId);
  let reviews = await Review.find({ product: productId });

  for (let i = 0; i < reviews.length; i++) {
    average += reviews[i].rating;
  }

  product.averageRate = average / reviews.length;
  await product.save();

  return res.json({ success: true, message: "rating added successfully" });
});

//update review
export let updateReview = asyncHandler(async (req, res, next) => {
  await Review.findByIdAndUpdate(req.params.id, { ...req.body });

  if (req.body.rating) {
    //calculate average rate
    let average = 0;
    let product = await Product.findById(req.params.productId);
    let reviews = await Review.find({ product: req.params.productId });

    for (let i = 0; i < reviews.length; i++) {
      average += reviews[i].rating;
    }
    product.averageRate = average / reviews.length;
    await product.save();
  }

  return res.json({ success: true, message: "review updated successfully" });
});
