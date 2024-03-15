import { response } from "express";
import { Coupon } from "../../../database/models/couponModel.js";
import { asyncHandler } from "../../utile/asyncHandler.js";
import voucher_codes from "voucher-code-generator";

//create coupon
export let createCoupon = asyncHandler(async (req, res, next) => {
  //generate code
  let code = voucher_codes.generate({ length: 5 })[0];

  //create coupon in database
  let coupon = await Coupon.create({
    code,
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
    createdBy: req.user._id,
  });

  //response
  return res.json({
    success: true,
    message: "coupon created successfully",
    coupon,
  });
});

//update coupon
export let updateCoupon = asyncHandler(async (req, res, next) => {
  //check coupon
  let coupon = await Coupon.findById(req.params.id);

  if (!coupon) return next(new Error("coupon is not exists!", { cause: 404 }));

  //check expired date
  if (coupon.expiredAt < Date.now())
    return next(new Error("coupon is expired", { cause: 400 }));

  //check owner
  if (coupon.createdBy.toString() != req.user._id.toString())
    return next(new Error("only coupon owner can update it", { cause: 403 }));

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();

  //response
  return res.json({ success: true, message: "coupon is updated successfully" });
});

//delete coupon
export let deleteCoupon = asyncHandler(async (req, res, next) => {
  //check coupon
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new Error("coupon is not exists!", { cause: 404 }));

  //check coupon owner
  if (coupon.createdBy.toString() != req.user._id.toString())
    return next(
      new Error("only coupon owner allowed to delete it", { cause: 403 })
    );

  //delete coupon
  await coupon.deleteOne();

  //response
  return res.json({ success: true, message: "coupon deleted successfully" });
});

//get all coupons
export let getAllCoupon = asyncHandler(async (req, res, next) => {
  //if admin
  if (req.user.role === "admin") {
    let coupons = await Coupon.find();
    //response
    res.json({ success: true, numberOfCoupons: coupons.length, coupons });
  }

  //if seller
  let coupons = await Coupon.find({ createdBy: req.user._id });
  //response
  res.json({ success: true, numberOfCoupons: coupons.length, coupons });
});
