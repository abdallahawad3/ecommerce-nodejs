import { Router } from "express";

import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyResetCode,
} from "../controllers/auth.controller.js";
import {
  FORGOT_PASSWORD,
  LOGIN_VALIDATION,
  RESET_PASSWORD,
  SIGNUP_VALIDATION,
  VERIFY_CODE,
} from "../validation/AuthValidation.js";

const router = Router();

router.route("/signup").post(SIGNUP_VALIDATION, signup);
router.route("/login").post(LOGIN_VALIDATION, login);
router.route("/forget-password").post(FORGOT_PASSWORD, forgotPassword);
router.route("/verify-password").post(VERIFY_CODE, verifyResetCode);
router.route("/reset-password").put(RESET_PASSWORD, resetPassword);
export default router;
