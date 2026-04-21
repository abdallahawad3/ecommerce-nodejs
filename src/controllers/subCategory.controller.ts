import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import SubCategory from "../models/subCategory.model.js";
import { InternalServerError, NotFoundError } from "../errors/index.js";
import categoryModel from "../models/category.model.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne } from "./handlersFactory.js";

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
   // 1) Build the query
    const documentCount = await SubCategory.countDocuments();
    const apiFeatures = new ApiFeatures(SubCategory.find(),req.query).paginate(documentCount).sort().limitFields().search("subCategory").filter();

    // 2) Execute the query
    const subCategories = await apiFeatures.mongooseQuery;
    res.status(200).json({
      status: "success",
      data: {
        subCategories,
      },
      pagination: apiFeatures.paginationResult,
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
export const updateSubCategory = updateOne(SubCategory);

/**
 * @desc Delete subCategory by id
 * @route DELETE /api/v1/subCategories/:id
 * @access Private
 */
export const deleteSubCategory = deleteOne(SubCategory);