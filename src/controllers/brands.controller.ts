import type { NextFunction, Request, Response } from "express";

import Brand from "../models/brand.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

/**
 * @desc Get all brands
 * @route GET /api/v1/brands
 * @access Public
 */
export const getAllBrands =  getAll(Brand);

/**
 * @desc Get brand by id
 * @route GET /api/v1/brands/:id
 * @access Public
 */
export const getBrandByID = getOne(Brand);

/**
 * @desc Create a new brand
 * @route POST /api/v1/brands
 * @access Public
 */
export const createBrand = createOne(Brand);

/**
 * @desc Update brand by id
 * @route PUT /api/v1/brands/:id
 * @access Public
 */
export const updateBrand = updateOne(Brand);

/**
 * @desc Delete brand by id
 * @route DELETE /api/v1/brands/:id
 * @access Public
 */
export const deleteBrand = deleteOne(Brand);