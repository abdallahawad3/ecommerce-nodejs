import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
  uploadUserImage,
  resizeUserImage,
  updateUserPassword,
} from "../controllers/user.controller.js";
import {
  CHANGE_PASSWORD_VALIDATION,
  CHECK_USER_ID,
  CREATE_USER_VALIDATION,
  UPDATE_USER_VALIDATION,
} from "../validation/userValidation.js";
import { allowedTo, auth } from "../controllers/auth.controller.js";

const router = Router();

router
  .route("/")
  .get(auth, allowedTo("admin"), getAllUsers)
  .post(
    auth,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    CREATE_USER_VALIDATION,
    createUser,
  );
router
  .route("/:id")
  .get(auth, allowedTo("admin"), CHECK_USER_ID, getOneUser)
  .put(
    auth,
    allowedTo("admin"),
    uploadUserImage,
    resizeUserImage,
    CHECK_USER_ID,
    UPDATE_USER_VALIDATION,
    updateUser,
  )
  .delete(auth, allowedTo("admin"), CHECK_USER_ID, deleteUser);

router
  .route("/:id/change-password")
  .put(CHECK_USER_ID, CHANGE_PASSWORD_VALIDATION, updateUserPassword);

export default router;
