import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import SubCategory from "../models/subCategoryModel.js";
import { InternalServerError, NotFoundError } from "../errors/index.js";
import categoryModel from "../models/categoryModel.js";

/**
 * @desc Get all subCategories
 * @route GET /api/v1/subCategories
 * @access Public
 */

export const getAllSubCategories = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const subCategories = await SubCategory.find({}, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name");
    res.status(200).json({
      status: "success",
      results: subCategories.length,
      page,
      data: {
        subCategories,
      },
    });
  },
);

/**
 * @desc Create new subCategory
 * @route POST /api/v1/subCategories
 * @access Private
 */

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

/**
 * @desc Get subCategory by id
 * @route GET /api/v1/subCategories/:id
 * @access Public
 */

export const getSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id, { __v: 0 });
    if (!subCategory) throw new NotFoundError("SubCategory not found", "NOT_FOUND_ERROR");

    res.status(200).json({
      status: "success",
      data: {
        subCategory,
      },
    });
  },
);

/**
 * @desc Update subCategory by id
 * @route PUT /api/v1/subCategories/:id
 * @access Private
 */
export const updateSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, category } = req.body;

    const existSubCategory = await SubCategory.findById(id);
    if (!existSubCategory) {
      throw new NotFoundError("SubCategory not found", "NOT_FOUND_ERROR");
    }

    const existCategory = await categoryModel.findById(category);

    if (!existCategory) {
      throw new NotFoundError("Category not found", "NOT_FOUND_ERROR");
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name, { lower: true }),
        category,
      },
      { new: true, runValidators: true },
    );
    if (!subCategory)
      throw new InternalServerError("Failed to update subCategory", "INTERNAL_SERVER_ERROR");

    res.status(200).json({
      status: "success",
      data: {
        subCategory,
      },
    });
  },
);

/**
 * @desc Delete subCategory by id
 * @route DELETE /api/v1/subCategories/:id
 * @access Private
 */

export const deleteSubCategory = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existSubCategory = await SubCategory.findById(id);
    if (!existSubCategory) {
      throw new NotFoundError("SubCategory not found", "NOT_FOUND_ERROR");
    }

    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      throw new InternalServerError("Failed to delete subCategory", "INTERNAL_SERVER_ERROR");
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
