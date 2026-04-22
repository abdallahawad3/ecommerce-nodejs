import multer from "multer"
import { v4 as uuidv4 } from "uuid";
import type { Response, Request, NextFunction } from "express";

import Category from "../models/category.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import AppError from "../errors/AppErrors.js";

// 1- DiskStorage engin
const multerStorage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"uploads/categories");
  },
  filename:function(req,file,cb){
    const ext = file.mimetype.split("/")[1];
    const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`
    cb(null,fileName)
  }
});

// 2- File filter
const mullerFilter = function(req: Request,file: Express.Multer.File,cb: multer.FileFilterCallback){
  // mainType/ext => image/png
  
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else {
    cb(new AppError("Only image allowed",400))
  }
}
// 3- Create the multer upload instance
const upload = multer({storage:multerStorage,fileFilter:mullerFilter});

// 4- Export the upload middleware for category image
export const uploadCategoryImage = upload.single("image");
/** @desc    Get all categories
 *@route   GET /api/categories
 * @access  Public
 * @returns {Object} 200 - An array of category objects
 * @returns {Object} 500 - Internal Server Error
 */
export const getAllCategories =  getAll(Category);

/**
 * @desc    Get a specific category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 * @returns {Object} 200 - The category object
 * @returns {Object} 404 - Category not found
 * @returns {Object} 400 - Invalid ID format
 * @returns {Object} 500 - Internal Server Error
 */
export const getSpecificCategory = getOne(Category);

/** @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private
 * @returns {Object} 201 - The created category object
 * @returns {Object} 400 - Bad Request
 * @returns {Object} 500 - Internal Server Error
 */
export const createCategory = createOne(Category);

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