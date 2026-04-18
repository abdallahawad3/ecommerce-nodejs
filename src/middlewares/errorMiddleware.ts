import type { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppErrors.js";
import { CastError, ValidationError } from "../errors/index.js";

const errorMiddleware = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  if (error.name == "ValidationError") {
    error = new ValidationError(error.message);
  }
  if (error.name === "CastError") {
    error = new CastError("Invalid ID format");
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
