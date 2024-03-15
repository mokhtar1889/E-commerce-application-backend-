import { Product } from "../../../database/models/productModel.js";
import { Cart } from "../../../database/models/cartModel.js";

export let updateStock = async (products, createOrder) => {
  if (createOrder) {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          soldItems: product.quantity,
          availableItems: -product.quantity,
        },
      });
    }
  } else {
    for (const product of products) {
      await Product.findByIdAndUpdate(product.productId, {
        $inc: {
          soldItems: -product.quantity,
          availableItems: product.quantity,
        },
      });
    }
  }
};

export let clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { products: [] });
};
