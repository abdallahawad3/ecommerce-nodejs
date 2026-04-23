import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express";

import Product from "../models/product.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import AppError from "../errors/AppErrors.js";
import { asyncWrapper } from "../utils/AsyncWrapper.js";

const multerStorage = multer.memoryStorage();
const multerFiltration = (req: Request, file: Express.Multer.File, cb: any) => {
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only Image are allowed", 400));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFiltration });

export const resizeProductImages = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    req.files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!req.files) throw new AppError("The images and image cover are required", 400);

    if (req.files.imageCover![0]) {
      const imageName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover![0].buffer)
        .resize(1920, 800)
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imageName}`);
      req.body.imageCover = imageName;
    }
    if (req.files.images) {
      const images: any = [];

      await Promise.all(
        req.files.images.map(async (img: any, idx: number) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${idx + 1}.jpeg`;

          await sharp(img.buffer)
            .resize(600, 600) // (60x60 is *very* small for products)
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);

          images.push(imageName);
        }),
      );

      req.body.images = images;
    }

    next();
  },
);

export const uploadProductImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);
/**
 * @desc Get all products
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = getAll(Product, "products");

/**
 * @desc Get a product by ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = getOne(Product, {
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
