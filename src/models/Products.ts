import { model, Schema } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [100, "Title must be less than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [20, "Description must be at least 20 characters"],
    maxlength: [1000, "Description must be less than 1000 characters"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity must be a positive number"],
  },
  sold: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
    max: [10000, "To avoid overflow, price must be less than 10,000"],
  },
  priceAfterDiscount: {
    type: Number,
    min: [0, "Price after discount must be a positive number"],
    max: [10000, "To avoid overflow, price after discount must be less than 10,000"],
  },
  colors: [String],
  imageCover: {
    type: String,
    required: [true, "Image cover is required"],
  },
  images: [String],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: [
    {
      type: Schema.Types.ObjectId,
      ref: "subCategory",
    },
  ],
  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
  },
  ratingsAverage: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
});

const Product = model("Product", schema);

export default Product;
