import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSpecificCategory,
  updateCategory,
} from "../services/categoryService.js";

const router = Router();

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getSpecificCategory).put(updateCategory).delete(deleteCategory);
export default router;
