import jwt from "jsonwebtoken";
import type { Response, Request, NextFunction } from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import User from "../models/users.model.js";
import { NotFoundError, UnauthorizedError } from "../errors/index.js";
import { compare } from "bcryptjs";
import createToken from "../utils/createToken.js";

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
 * @desc Authenticate a user
 * @route POST /api/authenticate
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
