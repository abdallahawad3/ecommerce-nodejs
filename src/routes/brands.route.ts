import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandByID,
  updateBrand,
} from "../controllers/brands.controller.js";
import { CHECK_ID_PARAMS, CHECK_NAME_BODY } from "../validation/Brands.js";

const router = Router();

router.route("/").get(getAllBrands).post(CHECK_NAME_BODY, createBrand);
router
  .route("/:id")
  .get(CHECK_ID_PARAMS, getBrandByID)
  .put(CHECK_ID_PARAMS, CHECK_NAME_BODY, updateBrand)
  .delete(CHECK_ID_PARAMS, deleteBrand);
export default router;
