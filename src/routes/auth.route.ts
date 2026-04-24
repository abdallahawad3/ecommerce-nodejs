import { Router } from "express";
import { login, signup } from "../controllers/auth.controller.js";
import { LOGIN_VALIDATION, SIGNUP_VALIDATION } from "../validation/AuthValidation.js";
const router = Router();

router.route("/signup").post(SIGNUP_VALIDATION, signup);
router.route("/login").post(LOGIN_VALIDATION, login);

export default router;
