import type { Response, Request, NextFunction } from "express";
import slugify from "slugify";

import Category from "../models/Category.js";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { NotFoundError, ValidationError } from "../errors/index.js";

/** @desc    Get all categories
 *@route   GET /api/categories
 * @access  Public
 * @returns {Object} 200 - An array of category objects
 * @returns {Object} 500 - Internal Server Error
 */

export const getAllCategories = asyncWrapper(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const categories = await Category.find({}, { __v: 0 }).skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
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
export const updateCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    throw new ValidationError("Category name is required", "VALIDATION_ERROR");
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name, { lower: true }) },
    { new: true, runValidators: true, __v: 0 },
  );

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

/**
 * @desc    Delete a category by ID
 * @route   DELETE /api/categories/:id
 * @access  Private
 * @returns {Object} 200 - The deleted category object
 * @returns {Object} 404 - Category not found
 * @returns {Object} 400 - Invalid ID format
 * @returns {Object} 500 - Internal Server Error
 */
export const deleteCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new NotFoundError(`Category not found for ID: ${id}`, "NOT_FOUND_ERROR");
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
