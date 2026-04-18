import { ADD_SUBCATEGORY_VALIDATION } from "./../validation/subCategoryValidation.js";
import { Router } from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
} from "../services/subCategoryService.js";
import { CHECK_ID_VALIDATION } from "../validation/categoryValidation.js";
const router = Router();

router.route("/").post(ADD_SUBCATEGORY_VALIDATION, createSubCategory).get(getAllSubCategories);
router
  .route("/:id")
  .get(CHECK_ID_VALIDATION, getSubCategory)
  .put(CHECK_ID_VALIDATION, ADD_SUBCATEGORY_VALIDATION, updateSubCategory)
  .delete(CHECK_ID_VALIDATION, deleteSubCategory);
export default router;
