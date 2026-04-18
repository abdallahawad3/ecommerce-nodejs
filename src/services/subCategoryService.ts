import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import SubCategory from "../models/subCategoryModel.js";
import { InternalServerError, NotFoundError } from "../errors/index.js";
import categoryModel from "../models/categoryModel.js";

/**
 * @desc Get all subCategories
 *
 */

export const getAllSubCategories = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const subCategories = await SubCategory.find({}, { __v: 0 }).populate({
      path: "category",
      select: "name",
    });
    res.status(200).json({
      status: "success",
      data: {
        subCategories,
      },
    });
  },
);

export const createSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, category } = req.body;

    const existCategory = await categoryModel.findById(category);
    if (!existCategory) {
      throw new NotFoundError("Category not found", "NOT_FOUND_ERROR");
    }

    const subCategory = await SubCategory.create({
      name,
      slug: slugify(name, { lower: true }),
      category: existCategory._id,
    });
    if (!subCategory)
      throw new InternalServerError("Failed to create subCategory", "INTERNAL_SERVER_ERROR");

    res.status(201).json({
      status: "success",
      data: {
        subCategory,
      },
    });
  },
);
