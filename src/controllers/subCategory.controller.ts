import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import SubCategory from "../models/subCategory.model.js";
import { InternalServerError, NotFoundError } from "../errors/index.js";
import categoryModel from "../models/category.model.js";

/**
 * @desc Set category id to body if category id is not in body but in params (from categoryRoute) then add it to body
 * @route POST /api/v1/categories/:id/subCategories
 * @access Private
 */
// This middleware is used to set category id to body if category id is not in body but in params (from categoryRoute) then add it to body
export const setCategoryIdToBody = (req: Request, res: Response, next: NextFunction) => {
  // if category id is not in body but in params (from categoryRoute) then add it to body
  if (!req.body.category) req.body.category = req.params.id;
  next();
};

/**
 * @desc Create filter object to filter subCategories by category id if category id is in params
 * @route GET /api/v1/subCategories or GET /api/v1/categories/:id/subCategories
 * @access Public
 */
export const createFilterObject = (req: Request, res: Response, next: NextFunction) => {
  let filterObject = {};
  if (req.params.id) {
    filterObject = { category: req.params.id };
  }
  req.filterObject = filterObject;
  next();
};

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

    const subCategories = await SubCategory.find(req.filterObject, { __v: 0 })
      .skip(skip)
      .limit(limit);
    // I don't need to populate category in subCategory because I will get category data
    //  in category route and I will get subCategories data in subCategory route so I will not populate category in subCategory
    //  because it will cause extra query to database and it will affect performance of the application
    // .populate("category", "name");
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
    if (!req.body.category) req.body.category = req.params.id; // if category id is not in body but in params (from categoryRoute) then add it to body

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
