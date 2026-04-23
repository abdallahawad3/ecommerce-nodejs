import multer from "multer";
import sharp from "sharp";
import type { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import Brand from "../models/brand.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import AppError from "../errors/AppErrors.js";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import uploadImage from "../middlewares/uploadImageMiddleware.js";

export const resizeBrandImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    req.file.filename = fileName;

    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    // Save the filename to req.body to be used in createBrand controller
    req.body.image = fileName;
    next();
  },
);

export const uploadBrandImage = uploadImage("image");

/**
 * @desc Get all brands
 * @route GET /api/v1/brands
 * @access Public
 */
export const getAllBrands = getAll(Brand);

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
