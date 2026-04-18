import { ADD_SUBCATEGORY_VALIDATION } from "./../validation/subCategoryValidation.js";
import { Router } from "express";
import { createSubCategory, getAllSubCategories } from "../services/subCategoryService.js";
const router = Router();

router.route("/").post(ADD_SUBCATEGORY_VALIDATION, createSubCategory).get(getAllSubCategories);

export default router;
