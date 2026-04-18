import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppErrors.js";
import { CastError, ValidationError } from "../errors/index.js";

const errorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  if (error?.cause?.code === 11000) {
    const keyValue = error?.cause?.keyValue;

    const field = Object.keys(keyValue)[0] as string;
    const value = keyValue[field];

    error = new AppError(`${field} "${value}" already exists`, 400, "DUPLICATE_FIELD");
  }

  // 🔥 MongoServerError (general fallback)
  if (error.name === "MongooseError") {
    error = new AppError("Database error occurred", 500, "DB_ERROR");
  }

  if (error.name == "ValidationError") {
    error = new ValidationError(error.message, "VALIDATION_ERROR");
  }

  if (error.name === "CastError") {
    error = new CastError("Invalid ID format", "CAST_ERROR");
  }

  // 🔥 Unknown Errors
  if (!(error instanceof AppError)) {
    error = new AppError("Internal Server Error", 500, "APP_ERROR");
  }
  // 🔥 Dev vs Prod
  if (process.env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode,
        stack: error.stack,
        name: error.name,
      },
    });
  }

  // 🔥 Production
  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      code: error.statusCode,
    },
  });
};

export default errorMiddleware;
