import {
  ADD_UPDATE_CATEGORY_VALIDATION,
  CHECK_ID_VALIDATION,
} from "./../validation/categoryValidation.js";
import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../services/categoryService.js";
import validation from "../middlewares/validation.js";

const router = Router();

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
