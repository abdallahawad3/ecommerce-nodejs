import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import { compare } from "bcryptjs";

import { asyncWrapper } from "../utils/AsyncWrapper.js";
import User from "../models/users.model.js";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/index.js";
import createToken from "../utils/createToken.js";
import { resizeUserImage } from "./user.controller.js";
import sendEmail, { emailTemplate } from "../utils/sendViaEmail.js";
import AppError from "../errors/AppErrors.js";

/**
 * @desc  Signup a new user
 * @route  POST /api/auth/signup
 * @access Public
 */
export const signup = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  // 1) Create user
  const user = await User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    slug: req.body.slug,
  });

  const token = createToken(user._id.toString());

  // 2) make token using JWT
  res.status(201).json({
    status: "success",
    data: user,
    token,
  });
});

/**
 * @desc  Login a user
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await compare(req.body.password, user.password))) {
    throw new NotFoundError("Invalid email or password", "NOT_FOUND_ERROR");
  }

  const token = createToken(user._id.toString());

  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});

/**
 * @desc  Protect routes - only for logged in users
 * @route  All routes after this middleware
 * @access Private
 */
export const auth = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  // 1) check if token exists
  let token: string;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1] as string;
  } else {
    throw new NotFoundError(
      "You are not logged in! Please log in to get access.",
      "NOT_FOUND_ERROR",
    );
  }

  // 2) verify token (if valid, expired, etc.)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
    userId: string;
    iat: number;
    exp: number;
  };

  // 3) check if user still exists

  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    throw new UnauthorizedError(
      "The user belonging to this token does no longer exist.",
      "UNAUTHORIZED_ERROR",
    );
  }

  // 4) check if user changed password after the token was issued
  if (currentUser.changePasswordDate) {
    const passwordChangedTimestamp = Math.floor(currentUser.changePasswordDate.getTime() / 1000);
    if (passwordChangedTimestamp > decoded.iat) {
      throw new UnauthorizedError(
        "The user recently changed their password. Please log in again.",
        "UNAUTHORIZED_ERROR",
      );
    }
  }

  req.user = currentUser;

  next();
});

/**
 * @desc  Restrict access to certain roles
 * @route  All routes after this middleware
 * @access Private (only for specific roles)
 */
export const allowedTo = (...requiredRole: string[]) =>
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError(
        "You are not logged in! Please log in to get access.",
        "FORBIDDEN_ERROR",
      );
    }

    if (!requiredRole.includes(req.user.role)) {
      throw new ForbiddenError(
        "You do not have permission to perform this action.",
        "FORBIDDEN_ERROR",
      );
    }

    next();
  });

/**
 * @desc Forgot password - send reset code to email
 * @route POST /api/auth/forget-password
 * @access Public
 */
export const forgotPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) check email from body and get user by email
    const user = await User.findOne({ email: req.body.email }); // We will validate email in validation layer
    if (!user) {
      throw new NotFoundError(
        `There are no user for this email: ${req.body.email}`,
        "NOT_FOUND_ERROR",
      );
    }

    // 2) if user exist generate random 6 digits and save it in our DB to check the code if is true or not
    const resetCode = Math.floor(10000 + Math.random() * 900000).toString();
    const hashedRestCode = jwt.sign(resetCode, process.env.JWT_SECRET_KEY!);
    const main = jwt.decode(hashedRestCode);

    // Save hashed code to DB
    user.passwordRestCode = hashedRestCode;
    // Add expiration time for password reset code (10m)
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.passwordVerified = false;
    await user.save();

    // 3) Send the reset code via `Email` ===> Very Very important feature

    try {
      await sendEmail({
        to: user.email,
        subject: "Your password reset code (valid for 10 minutes)",
        text: `Your password reset code is: ${resetCode}`,
        html: emailTemplate(user.name, resetCode), // You can customize this HTML template as needed
      });
    } catch (error) {
      console.log(error);
      user.passwordRestCode = null;
      user.passwordResetExpires = null;
      user.passwordVerified = null;
      await user.save();
      throw new Error("There was an error sending the email. Try again later.");
    }

    res.status(200).json({
      status: "success",
      message: "Reset code sent to email!",
    });
  },
);

/**
 * @desc Verify reset code and allow user to reset password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const verifyResetCode = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    // 1) Get user based on email
    const hashedOTP = jwt.sign(otp, process.env.JWT_SECRET_KEY!);
    const user = await User.findOne({
      passwordResetExpires: { $gt: Date.now() },
      passwordRestCode: hashedOTP,
    });

    if (!user) {
      throw new AppError("The reset code invalid or expired", 500, "APP_ERROR");
    }

    console.log(user.passwordRestCode);
    console.log(hashedOTP);

    user.passwordVerified = true;

    await user.save();

    res.status(200).json({
      status: "success",
    });
  },
);

export const resetPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError(`There are no user for this email: ${email}`, "NOT_FOUND_ERROR");
    }

    if (!user.passwordVerified) {
      throw new AppError("You have not verified your reset code", 400, "APP_ERROR");
    }

    user.password = password;
    user.passwordRestCode = null;
    user.passwordResetExpires = null;
    user.passwordVerified = null;
    const token = createToken(user._id.toString());
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Password reset successful",
      token,
    });
  },
);
