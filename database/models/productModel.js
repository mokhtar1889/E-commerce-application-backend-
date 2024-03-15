import { Schema, Types, model } from "mongoose";

let productSchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 20 },
    description: { type: String, min: 10, max: 200 },
    images: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    defaultImage: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1 },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Types.ObjectId, ref: "Subcategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
    averageRate: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//final price
productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});

//paginate
productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  let limit = 2;
  let skip = limit * (page - 1);

  return this.skip(skip).limit(limit);
};

//search
productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({ name: { $regex: keyword, $options: "i" } });
  }
  return this;
};

//instock
productSchema.methods.inStock = function (quantity) {
  return this.availableItems >= quantity ? true : false;
};

//review virsual
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

export let Product = model("Product", productSchema);
