import slugify from "slugify";
import { body } from "express-validator";
import validation from "../middlewares/validation.js";
import User from "../models/users.model.js";
import { compare } from "bcryptjs";
import AppError from "../errors/AppErrors.js";

export const SIGNUP_VALIDATION = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .custom((value, { req }) => {
      const slug = slugify(value, { lower: true });
      req.body.slug = slug;
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),

  validation,
];

export const LOGIN_VALIDATION = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  validation,
];
