import { asyncHandler } from "../../utile/asyncHandler.js";
import { Coupon } from "../../../database/models/couponModel.js";
import { Cart } from "../../../database/models/cartModel.js";
import { Product } from "../../../database/models/productModel.js";
import { Order } from "../../../database/models/orderModel.js";
import createInvoice from "../../utile/pdfInvoice.js";
import cloudinary from "../../utile/cloudinary.js";
import path from "path";
import { sendEmail } from "../../utile/sendEmail.js";
import { fileURLToPath } from "url";
import { updateStock, clearCart } from "./orderService.js";
import Stripe from "stripe";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//create order
export let createOrder = asyncHandler(async (req, res, next) => {
  let { phone, address, coupon, payment } = req.body;

  //check coupon
  let checkCoupon;
  if (coupon) {
    checkCoupon = await Coupon.findOne({
      code: coupon,
      expiredAt: { $gt: Date.now() },
    });

    if (!checkCoupon) return next(new Error("invalid coupon", { cause: 400 }));
  }

  //get product from cart
  let cart = await Cart.findOne({ user: req.user._id });
  let products = cart.products;
  if (products.length < 1)
    return next(new Error("cart is empty", { cause: 400 }));

  let orderedProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    let product = await Product.findById(products[i].productId);
    if (!product)
      return next(new Error("product is not exists!", { cause: 404 }));
    if (!product.inStock(products[i].quantity))
      return next(
        new Error(
          `product out of stock!.only${products[i].quantity} ara available`,
          { cause: 400 }
        )
      );

    orderedProducts.push({
      name: product.name,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
      productId: product._id,
    });

    orderPrice += product.finalPrice * products[i].quantity;
  }

  console.log(orderPrice);

  //create order in database
  let order = await Order.create({
    user: req.user._id,
    phone,
    address,
    payment,
    products: orderedProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });

  console.log(order);

  //create invoice
  const invoice = {
    shipping: {
      name: req.user.username,
      address: order.address,
      country: "Egypt",
    },
    items: order.products,
    subtotal: order.price,
    paid: order.finalPrice !== "NaN" ? order.finalPrice : order.price,
    invoice_nr: order._id,
  };

  console.log(invoice, "invoice");

  let pdfPath = path.join(__dirname, `./../../tempinvoices/${order._id}.pdf`);

  createInvoice(invoice, pdfPath);

  //upload invoice in cloudinary
  let { public_id, secure_url } = await cloudinary.uploader.upload(pdfPath, {
    folder: "E-Commerce/orders/invoices",
  });

  //add invoice to database
  order.invoice = { id: public_id, url: secure_url };
  await order.save();

  //send email with invoice
  let isSent = await sendEmail({
    to: req.user.email,
    subject: "order invoice",
    attachments: [{ path: secure_url, contentType: "application/pdf" }],
  });

  //update stock
  updateStock(order.products, true);

  //clear cart
  clearCart(req.user._id);

  //visa payment
  if (payment === "visa") {
    let stripe = new Stripe(process.env.STRIPE_KEY);

    //check coupon
    let isCouponExists;
    if (order.coupon != undefined) {
      isCouponExists = await stripe.coupons.create({
        percent_off: order.coupon.discount,
        duration: "once",
      });
    }
    let session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
            },
            unit_amount: product.itemPrice * 100,
          },
          quantity: product.quantity,
        };
      }),
      discounts: isCouponExists ? [{ coupon: isCouponExists.id }] : [],
    });
    return res.json({
      success: true,
      url: session.url,
    });
  }

  //send response
  return res.json({
    success: true,
    message: "order created successfully",
    order,
  });
});

//cancel order
export let cancelOrder = asyncHandler(async (req, res, next) => {
  //check order
  let order = await Order.findById(req.params.id);
  if (!order) return next(new Error("order is not exists!", { cause: 404 }));

  //check order state
  if (order.status === "deliverd" || order.status === "canceled")
    return next(new Error("can not cancel order!", { cause: 404 }));

  //cancel order
  order.status = "canceled";
  order.save();

  //update strock
  updateStock(order.products, false);

  //response
  return res.json({ success: true, message: "order canceled successfully" });
});
