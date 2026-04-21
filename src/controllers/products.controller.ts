import type { Request, Response, NextFunction } from "express";
import slugify from "slugify";

import { asyncWrapper } from "../utils/AsyncWrapper.js";
import Product from "../models/product.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    
    // 1) Build the query
    const documentCount = await Product.countDocuments();
    const apiFeatures = new ApiFeatures(Product.find(),req.query).paginate(documentCount).sort().limitFields().search().filter();

    // 2) Execute the query
    const products = await apiFeatures.mongooseQuery;
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
      pagination: apiFeatures.paginationResult,
    });
  }
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
