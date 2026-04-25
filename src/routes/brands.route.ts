import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandByID,
  resizeBrandImage,
  updateBrand,
  uploadBrandImage,
} from "../controllers/brands.controller.js";
import { CHECK_ID_PARAMS, CHECK_NAME_BODY } from "../validation/Brands.js";
import { allowedTo, auth } from "../controllers/auth.controller.js";

const router = Router();

router
  .route("/")
  .get(getAllBrands)
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    CHECK_NAME_BODY,
    createBrand,
  );
router
  .route("/:id")
  .get(CHECK_ID_PARAMS, getBrandByID)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeBrandImage,
    CHECK_ID_PARAMS,
    CHECK_NAME_BODY,
    updateBrand,
  )
  .delete(auth, allowedTo("admin"), CHECK_ID_PARAMS, deleteBrand);
export default router;
