import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  resizeProductImages,
  updateProduct,
  uploadProductImages,
} from "../controllers/products.controller.js";
import { CHECK_PRODUCT_ID, createProductValidation } from "../validation/ProductsValidation.js";
import { allowedTo, auth } from "../controllers/auth.controller.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    auth,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidation,
    createProduct,
  );
router
  .route("/:id")
  .get(CHECK_PRODUCT_ID, getProductById)
  .put(
    auth,
    allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    CHECK_PRODUCT_ID,
    updateProduct,
  )
  .delete(auth, allowedTo("admin"), CHECK_PRODUCT_ID, deleteProduct);

export default router;
