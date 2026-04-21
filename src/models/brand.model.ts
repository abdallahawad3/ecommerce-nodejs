import { model, Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true,
  },
);

const Brand = model("Brand", brandSchema);

export default Brand;
