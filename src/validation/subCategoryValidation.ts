import { body, param } from "express-validator";
import validation from "../middlewares/validation.js";
import slugify from "slugify";
export const CHECK_ID_VALIDATION = [
  param("id").isMongoId().withMessage("Invalid category ID format"),
  validation,
];

export const ADD_SUBCATEGORY_VALIDATION = [
  body("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be between 3 and 32 characters"),
    body("name").custom((value, { req }) => {
      if (value) {
        req.body.slug = slugify(value, { lower: true });
      }
      return true;
    }),
  body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid category ID format"),
  validation,
];

export const UPDATE_SUBCATEGORY_VALIDATION = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("SubCategory name cannot be empty")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Name must be between 3 and 32 characters"),
  body("category")
    .optional()
    .notEmpty()
    .withMessage("Category ID cannot be empty")
    .isMongoId()
    .withMessage("Invalid category ID format"),
    body("name").custom((value, { req }) => {
      if (value) {
        req.body.slug = slugify(value, { lower: true });
      }
      return true;
    }),
  validation,
];
