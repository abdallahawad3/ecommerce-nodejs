import type { Response, Request, NextFunction } from "express";
import slugify from "slugify";

import Category from "../models/category.model.js";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { NotFoundError, ValidationError } from "../errors/index.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteOne, updateOne } from "./handlersFactory.js";

/** @desc    Get all categories
 *@route   GET /api/categories
 * @access  Public
 * @returns {Object} 200 - An array of category objects
 * @returns {Object} 500 - Internal Server Error
 */

export const getAllCategories = asyncWrapper(async (req: Request, res: Response) => {
   // 1) Build the query
    const documentCount = await Category.countDocuments();
    const apiFeatures = new ApiFeatures(Category.find(),req.query).paginate(documentCount).sort().limitFields().search("category").filter();

    // 2) Execute the query
    const categories = await apiFeatures.mongooseQuery;
    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
      pagination: apiFeatures.paginationResult,
    });
});

/**
 * @desc    Get a specific category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 * @returns {Object} 200 - The category object
 * @returns {Object} 404 - Category not found
 * @returns {Object} 400 - Invalid ID format
 * @returns {Object} 500 - Internal Server Error
 */
export const getSpecificCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findById(id, { __v: 0 });

  if (!category) {
    throw new NotFoundError(`Category not found for ID: ${id}`, "NOT_FOUND_ERROR");
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

/** @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private
 * @returns {Object} 201 - The created category object
 * @returns {Object} 400 - Bad Request
 * @returns {Object} 500 - Internal Server Error
 */
export const createCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new ValidationError("Category name is required", "VALIDATION_ERROR");
  }

  const category = await Category.create({
    name,
    slug: slugify(name, { lower: true }),
  });

  const { __v, ...categoryData } = category.toObject();

  res.status(201).json({
    status: "success",
    data: {
      category: categoryData,
    },
  });
});

/** @desc    Update an existing category
 * @route   PUT /api/categories/:id
 * @access  Private
 * @returns {Object} 200 - The updated category object
 */
export const updateCategory = updateOne(Category);

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/categories/:id
 * @access  Private
 * @returns {Object} 200 - The deleted category object
 * @returns {Object} 404 - Category not found
 * @returns {Object} 400 - Invalid ID format
 * @returns {Object} 500 - Internal Server Error
 */
export const deleteCategory = deleteOne(Category);