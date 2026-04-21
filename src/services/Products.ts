import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";

import { asyncWrapper } from "../utils/AsyncWrapper.js";
import Product from "../models/Products.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import transformQuery from "../utils/transformQuery.js";
import type { SortOrder } from "mongoose";

/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // 2) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);

    const parsedQuery = transformQuery(queryObj);

    let mongooseQuery = Product.find(parsedQuery)
      .skip(skip)
      .limit(limit)
      .populate("category", "name");

    // 3) Sorting
    if (req.query.sort as string) {
      const sortFields = (req.query.sort as string).split(",").join(" ");
      // Sort take the format of "field" for ascending and "-field" for descending and multiple fields can be sorted by separating them with a space
      mongooseQuery = mongooseQuery.sort(sortFields);
    } else {
      mongooseQuery = mongooseQuery.sort("-createdAt");
    }
    // 4) Field Limiting
    if (req.query.fields as string) {
      const fields = (req.query.fields as string).split(",").join(" ");
      console.log(fields);

      mongooseQuery = mongooseQuery.select(fields);
    } else {
      mongooseQuery = mongooseQuery.select("-__v");
    }

    // 5) Executing the query
    const products = await mongooseQuery;

    // TODO: Handle and update pagination data
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
      page,
      limit,
      result: products.length,
    });
  },
);

/**
 * @desc Get a product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequestError("The product ID is required", "BAD_REQUEST_ERROR");
    }

    const product = await Product.findById(productId, { __v: 0 });

    if (!product) {
      throw new NotFoundError(`Product for the given ID:${productId} not found`, "NOT_FOUND_ERROR");
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * @desc Create a new product
 * @route POST /api/products
 * @access Private
 */
export const createProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    req.body.slug = slugify(req.body.title, { lower: true });

    const product = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * @desc Update a product by ID
 * @route PUT /api/products/:id
 * @access Private
 */
export const updateProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequestError("The product ID is required", "BAD_REQUEST_ERROR");
    }

    if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true });

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
      select: "-__v",
    });

    if (!product) {
      throw new NotFoundError(`Product for the given ID:${productId} not found`, "NOT_FOUND_ERROR");
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);

/**
 * @desc Delete a product by ID
 * @route DELETE /api/products/:id
 * @access Private
 */
export const deleteProduct = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    if (!productId) {
      throw new BadRequestError("The product ID is required", "BAD_REQUEST_ERROR");
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new NotFoundError(`Product for the given ID:${productId} not found`, "NOT_FOUND_ERROR");
    }

    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  },
);
