import { asyncHandler } from "../../utile/asyncHandler.js";
import { Cart } from "../../../database/models/cartModel.js";
import { Product } from "../../../database/models/productModel.js";

//add to cart
export let addToCart = asyncHandler(async (req, res, next) => {
  let { productId, quantity } = req.body;

  //check product
  let product = await Product.findById(productId);
  if (!product)
    return next(new Error("product is not exists!", { cause: 404 }));

  //check stock
  if (!product.inStock(quantity))
    return next(
      new Error(
        `out of stock!. only ${product.availableItems} items are available `
      )
    );

  //check if product is exists in the cart
  let isProductInCart = await Cart.findOne({
    user: req.user._id,
    "products.productId": productId,
  });

  if (isProductInCart) {
    let theproduct = isProductInCart.products.find((pro) => {
      return pro.productId.toString() === productId.toString();
    });

    //check stock
    if (product.inStock(theproduct.quantity + quantity)) {
      theproduct.quantity = theproduct.quantity + quantity;
      await isProductInCart.save();
      return res.json({ success: true, message: "cart updated" });
    } else {
      return next(
        new Error(`sorry only ${product.availableItems} in stock`, {
          cause: 400,
        })
      );
    }
  }

  //add product to products array
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $push: { products: { productId, quantity } },
    },
    { new: true }
  );

  //response
  return res.json({ success: true, message: "product added to cart" });
});

//get user  cart
export let getUserCart = asyncHandler(async (req, res, next) => {
  //user
  if (req.user.role == "user") {
    let cart = await Cart.findOne({ user: req.user._id });
    return res.json({ success: true, cart });
  }

  if (req.user.role == "admin" && !req.body.cartId)
    return next(new Error("cart id is required!", { cause: 400 }));

  //admin
  if (req.user.role == "admin") {
    let cart = await Cart.findById(req.body.cartId);
    if (!cart)
      return next(new Error("this cart is not exists!", { cause: 404 }));
    return res.json({ success: true, cart });
  }
});

//update cart
export let updateCart = asyncHandler(async (req, res, next) => {
  let { productId, quantity } = req.body;

  //check product
  let product = await Product.findById(productId);
  if (!product)
    return next(new Error("product is not exists!", { cause: 404 }));

  //check stock
  if (!product.inStock(quantity))
    return next(
      new Error(
        `out of stock!. only ${product.availableItems} items are available `
      )
    );

  let cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    { "products.$.quantity": quantity },
    {
      new: true,
    }
  );

  return res.json({
    success: true,
    message: "cart updated successfully",
    cart,
  });
});

//remove from cart
export let removeFromCart = asyncHandler(async (req, res, next) => {
  let { id } = req.params;

  console.log(id);

  let productInCart = await Cart.findOne({ "products.productId": id });
  console.log(productInCart);
  if (!productInCart)
    return next(new Error("product is not exists in this cart"));

  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { products: { productId: id } },
    },
    {
      new: true,
    }
  );

  return res.json({ success: true, message: "product removed from cart" });
});

//clear cart
export let clearCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      products: [],
    },
    {
      new: true,
    }
  );
  return res.json({ success: true, message: "cart is clear now", cart });
});
