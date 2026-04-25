import { ADD_SUBCATEGORY_VALIDATION } from "../validation/subCategoryValidation.js";
import { Router } from "express";
import {
  createFilterObject,
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategory,
  setCategoryIdToBody,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import { CHECK_ID_VALIDATION } from "../validation/categoryValidation.js";
import { allowedTo, auth } from "../controllers/auth.controller.js";

// mergeParams: true to access category id in subCategoryRoute Access params from parent route (categoryRoute)
// ex: /categories/:id/subCategories ==> access category id in subCategoryRoute using req.params.id
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    auth,
    allowedTo("admin", "manager"),
    setCategoryIdToBody,
    ADD_SUBCATEGORY_VALIDATION,
    createSubCategory,
  )
  .get(createFilterObject, getAllSubCategories);
router
  .route("/:id")
  .get(CHECK_ID_VALIDATION, getSubCategory)
  .put(
    auth,
    allowedTo("admin", "manager"),
    CHECK_ID_VALIDATION,
    ADD_SUBCATEGORY_VALIDATION,
    updateSubCategory,
  )
  .delete(auth, allowedTo("admin"), CHECK_ID_VALIDATION, deleteSubCategory);
export default router;
