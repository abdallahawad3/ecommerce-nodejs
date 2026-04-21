import type { NextFunction, Request, Response } from "express";
import slugify from "slugify";

import { asyncWrapper } from "../utils/AsyncWrapper.js";
import Brand from "../models/brand.model.js";
import { InternalServerError, NotFoundError } from "../errors/index.js";

/**
 * @desc Get all brands
 * @route GET /api/v1/brands
 * @access Public
 */
export const getAllBrands = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const brands = await Brand.find({}, { __v: 0 }).skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      results: brands.length,
      page,
      data: {
        brands,
      },
    });
  },
);

/**
 * @desc Create a new brand
 * @route POST /api/v1/brands
 * @access Public
 */
export const createBrand = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const brand = await Brand.create({ name, slug: slugify(name, { lower: true }) });

  if (!brand) {
    throw new InternalServerError("Failed to create brand", "INTERNAL_SERVER_ERROR");
  }

  res.status(201).json({
    status: "success",
    data: {
      brand,
    },
  });
});

/**
 * @desc Get brand by id
 * @route GET /api/v1/brands/:id
 * @access Public
 */
export const getBrandByID = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const brand = await Brand.findById(id, { __v: 0 });
    if (!brand) {
      throw new NotFoundError("Brand not found", "NOT_FOUND_ERROR");
    }

    res.status(200).json({
      status: "success",
      data: {
        brand,
      },
    });
  },
);

/**
 * @desc Update brand by id
 * @route PUT /api/v1/brands/:id
 * @access Public
 */
export const updateBrand = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, slug: slugify(name, { lower: true }) },
    { new: true, runValidators: true, select: "-__v" },
  );
  if (!brand) {
    throw new NotFoundError("Brand not found", "NOT_FOUND_ERROR");
  }
  res.status(200).json({
    status: "success",
    data: {
      brand,
    },
  });
});

/**
 * @desc Delete brand by id
 * @route DELETE /api/v1/brands/:id
 * @access Public
 */
export const deleteBrand = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new NotFoundError("Brand not found", "NOT_FOUND_ERROR");
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
