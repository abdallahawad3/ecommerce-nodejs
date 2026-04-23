import slugify from "slugify";
import { body, param } from "express-validator";
import validation from "../middlewares/validation.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";

export const CREATE_USER_VALIDATION = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("The name is required")
    .isString()
    .withMessage("The name must be an string")
    .isLength({ min: 3, max: 20 })
    .withMessage("The length of the name at least 3 characters and at most 20 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  body("email")
    .isEmail()
    .withMessage("The email is invalid")
    .customSanitizer((val) => val.toLowerCase())
    .custom(async (val) => {
      // Check if email exist in DB or not
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error("The email is already exist"));
      }
      return true;
    }),
  body("password")
    .isString()
    .withMessage("The password must be an string")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters"),
  body("phone").optional().isMobilePhone("ar-EG").withMessage("The phone number is invalid"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("The role must be either user or admin")
    .default("user"),
  body("confirmPassword")
    .isString()
    .withMessage("The confirm password must be an string")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("The confirm password does not match the password");
      }
      return true;
    }),
  validation,
];

export const CHECK_USER_ID = [
  param("id").isMongoId().withMessage("Invalid user id format"),
  validation,
];

export const CHANGE_PASSWORD_VALIDATION = [
  body("currentPassword").custom(async (val, { req }) => {
    const user = await User.findById(req.params!.id);
    if (!user) {
      throw new Error("No user found with this id");
    }
    const isMatch = await bcrypt.compare(val, user.password);
    if (!isMatch) {
      throw new Error("The current password is incorrect");
    }
    return true;
  }),
  body("newPassword")
    .isString()
    .withMessage("The new password must be an string")
    .isLength({ min: 6 })
    .withMessage("The new password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val === req.body.currentPassword) {
        throw new Error("The new password must be different from the current password");
      }
      return true;
    }),
  body("confirmNewPassword")
    .isString()
    .withMessage("The confirm new password must be an string")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("The confirm new password does not match the new password");
      }
      return true;
    }),
  validation,
];

export const UPDATE_USER_VALIDATION = [
  body("name")
    .optional()
    .trim()
    .isString()
    .withMessage("The name must be an string")
    .isLength({ min: 3, max: 20 })
    .withMessage("The length of the name at least 3 characters and at most 20 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),
  body("password")
    .optional()
    .isString()
    .withMessage("The password must be an string")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters"),
  body("phone").optional().isMobilePhone("ar-EG").withMessage("The phone number is invalid"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("The role must be either user or admin"),
  body("profileImage").optional().isString().withMessage("The profile image must be a string"),
  validation,
];
