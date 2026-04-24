import multer from "multer";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import type { NextFunction, Request, Response } from "express";

import User from "../models/users.model.js";
import { createOne, deleteOne, getAll, getOne, updateOne } from "./handlersFactory.js";
import AppError from "../errors/AppErrors.js";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import bcrypt from "bcryptjs";

// Handel upload image
const multerStorage = multer.memoryStorage();
const multerFiltration = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(new AppError("The file must be an image only", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiltration,
});

export const uploadUserImage = upload.single("profileImage");

export const resizeUserImage = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    // // Check if exist file or not
    // if (!req.file) return next(new AppError("No file uploaded", 400));

    if (req.file) {
      const fileName = `user-${uuid()}-${Date.now()}.jpeg`;
      req.file.filename = fileName;

      await sharp(req.file.buffer)
        .resize(600, 600)
        .jpeg({ quality: 100 })
        .toFile(`uploads/users/${fileName}`);

      // Save image name to !!DB!!
      req.body.profileImage = fileName;
    }
    next();
  },
);

/**
 * @desc    Create a new user
 * @route   POST /api/v1/users
 * @access  Private (admin only)
 */
export const createUser = createOne(User);

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private (admin only)
 */
export const getAllUsers = getAll(User);

/**
 * @desc    Get a user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private (admin only)
 */
export const getOneUser = getOne(User);

/**
 * @desc    Update a user by ID
 * @route   PUT /api/v1/users/:id
 * @access  Private (admin only)
 */
export const updateUser = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with this id", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({ status: "success", data: updatedUser });
});

export const updateUserPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hashSync(req.body.newPassword, 12),
        changePasswordDate: Date.now(),
      },
      { new: true },
    );

    if (!user) {
      throw new AppError("No user found with this id", 404);
    }

    res.status(200).json({ status: "success", data: user });
  },
);

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/v1/users/:id
 * @access  Private (admin only)
 */
export const deleteUser = deleteOne(User);
