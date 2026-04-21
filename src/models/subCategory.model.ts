import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this sub category"],
      trim: true,
      unique: [true, "The name of subCategory must be unique"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [100, "Name is too long"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    category: {
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "The category id is required for subcategory"],
    },
  },
  { timestamps: true },
);
const SubCategory = model("subCategory", schema);

export default SubCategory;
