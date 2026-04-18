import { Router } from "express";
import { createSubCategory, getAllSubCategories } from "../services/subCategoryService.js";
const router = Router();

router.route("/").post(createSubCategory).get(getAllSubCategories);

export default router;
