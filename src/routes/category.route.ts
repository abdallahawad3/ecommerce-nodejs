import { Router } from "express";
import {
  ADD_UPDATE_CATEGORY_VALIDATION,
  CHECK_ID_VALIDATION,
} from "../validation/categoryValidation.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  resizeCategoryImage,
  updateCategory,
  uploadCategoryImage,
} from "../controllers/category.controller.js";
import subCategoryRoute from "./subCategory.route.js";
import validation from "../middlewares/validation.js";

const router = Router();

router.use("/:id/subCategories", subCategoryRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(uploadCategoryImage, resizeCategoryImage, ADD_UPDATE_CATEGORY_VALIDATION, createCategory);

router
  .route("/:id")
  .get(CHECK_ID_VALIDATION, getSpecificCategory)
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    CHECK_ID_VALIDATION,
    ADD_UPDATE_CATEGORY_VALIDATION,
    updateCategory,
  )
  .delete(CHECK_ID_VALIDATION, deleteCategory);
export default router;
