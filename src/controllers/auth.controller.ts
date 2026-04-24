import type { Response, Request, NextFunction } from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import User from "../models/users.model.js";
import { NotFoundError } from "../errors/index.js";
import { compare } from "bcryptjs";
import createToken from "../utils/createToken.js";

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
