import type { Request, Response, NextFunction } from "express";

import SubCategory from "../models/subCategory.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

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
export const getAllSubCategories = getAll(SubCategory);

/**
 * @desc Get subCategory by id
 * @route GET /api/v1/subCategories/:id
 * @access Public
 */
export const getSubCategory = getOne(SubCategory,{path:"category",
select:"name _id"
});

/**
 * @desc Create new subCategory
 * @route POST /api/v1/subCategories
 * @access Private
 */
export const createSubCategory = createOne(SubCategory);


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