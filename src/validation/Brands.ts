import { body, param } from "express-validator";
import validation from "../middlewares/validation.js";

export const CHECK_ID_PARAMS = [
  param("id").isMongoId().withMessage("Invalid id format"),
  validation,
];
export const CHECK_NAME_BODY = [
  body("name").isString().withMessage("Name must be a string"),
  validation,
];
