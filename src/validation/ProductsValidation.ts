import { body, check, param } from "express-validator";
import slugify from "slugify";
import validation from "../middlewares/validation.js";

export const createProductValidation = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("colors").optional().isArray().withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images").optional().isArray().withMessage("images should be array of string"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()
    .custom((val, { req }) => {
      if (req.body.price <= val) {
        throw new Error("Price after discount must be lower than price");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid category id"),

  check("subCategory").optional().isMongoId().withMessage("Invalid subCategory id"),
  check("brand").optional().isMongoId().withMessage("Invalid brand id"),

  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1 and 5"),
  check("ratingsQuantity").optional().isNumeric().withMessage("Ratings quantity must be a number"),
  validation,
];

export const CHECK_PRODUCT_ID = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  validation,
];
