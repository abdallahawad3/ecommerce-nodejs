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
  updateCategory,
} from "../services/Category.js";
import subCategoryRoute from "./SubCategory.js";
import validation from "../middlewares/validation.js";

const router = Router();

router.use("/:id/subCategories", subCategoryRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(ADD_UPDATE_CATEGORY_VALIDATION, validation, createCategory);
router
  .route("/:id")
  .get(CHECK_ID_VALIDATION, validation, getSpecificCategory)
  .put(ADD_UPDATE_CATEGORY_VALIDATION, CHECK_ID_VALIDATION, validation, updateCategory)
  .delete(CHECK_ID_VALIDATION, validation, deleteCategory);
export default router;
