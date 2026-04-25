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
import { allowedTo, auth } from "../controllers/auth.controller.js";

const router = Router();

router.use("/:id/subCategories", subCategoryRoute);

router
  .route("/")
  .get(getAllCategories)
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    ADD_UPDATE_CATEGORY_VALIDATION,
    createCategory,
  );

router
  .route("/:id")
  .get(CHECK_ID_VALIDATION, getSpecificCategory)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeCategoryImage,
    CHECK_ID_VALIDATION,
    ADD_UPDATE_CATEGORY_VALIDATION,
    updateCategory,
  )
  .delete(auth, allowedTo("admin"), CHECK_ID_VALIDATION, deleteCategory);
export default router;
