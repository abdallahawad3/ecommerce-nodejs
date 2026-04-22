import type { Request, Response, NextFunction } from "express";

import Product from "../models/product.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";

/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = getAll(Product,"products");

/**
 * @desc Get a product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = getOne(Product,{
  path: "category brand",
  select: "name -_id",
});
/**
 * @desc Create a new product
 * @route POST /api/products
 * @access Private
 */
export const createProduct = createOne(Product);

/**
 * @desc Update a product by ID
 * @route PUT /api/products/:id
 * @access Private
 */
export const updateProduct = updateOne(Product);
/**
 * @desc Delete a product by ID
 * @route DELETE /api/products/:id
 * @access Private
 */
export const deleteProduct = deleteOne(Product);
