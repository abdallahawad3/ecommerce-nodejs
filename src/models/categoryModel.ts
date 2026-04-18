import { model, Schema } from "mongoose";

const categoryScheme = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name must be at least 3 characters long"],
      maxLength: [32, "Category name must be at most 32 characters long"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const categoryModel = model("Category", categoryScheme);

export default categoryModel;
