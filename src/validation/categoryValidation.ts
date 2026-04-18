import { body, param } from "express-validator";

export const ADD_UPDATE_CATEGORY_VALIDATION = [
  body("name").notEmpty().withMessage("Category name is required"),
];

export const CHECK_ID_VALIDATION = [
  param("id").isMongoId().withMessage("Invalid category ID format"),
];
