import { body, param } from "express-validator";
import validation from "../middlewares/validation.js";

export const ADD_UPDATE_CATEGORY_VALIDATION = [
  body("name").isString().withMessage("Category name must be a string").notEmpty().withMessage("Category name is required"),
  body("name").custom((value, { req }) => {
    req.body.slug = value.toLowerCase().replace(/\s+/g, "-");
    return true;
  }),
  validation,
];

export const CHECK_ID_VALIDATION = [
  param("id").isMongoId().withMessage("Invalid category ID format"),
  validation
];
