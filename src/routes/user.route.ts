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

const router = Router();

router
  .route("/")
  .get(getAllUsers)
  .post(uploadUserImage, resizeUserImage, CREATE_USER_VALIDATION, createUser);
router
  .route("/:id")
  .get(CHECK_USER_ID, getOneUser)
  .put(uploadUserImage, resizeUserImage, CHECK_USER_ID, UPDATE_USER_VALIDATION, updateUser)
  .delete(CHECK_USER_ID, deleteUser);

router
  .route("/:id/change-password")
  .put(CHECK_USER_ID, CHANGE_PASSWORD_VALIDATION, updateUserPassword);

export default router;
