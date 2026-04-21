import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/products.controller.js";
import { CHECK_PRODUCT_ID, createProductValidation } from "../validation/ProductsValidation.js";

const router = Router();

router.route("/").get(getAllProducts).post(createProductValidation, createProduct);
router
  .route("/:productId")
  .get(CHECK_PRODUCT_ID, getProductById)
  .put(CHECK_PRODUCT_ID, updateProduct)
  .delete(CHECK_PRODUCT_ID, deleteProduct);

export default router;
