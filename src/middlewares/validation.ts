import type { Request, Response, NextFunction } from "express";
import { param, validationResult } from "express-validator";
import path from "node:path";
const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req) as any;
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      message: errors.array()[0].msg,
      param: errors.array()[0].param,
      path: errors.array()[0].location as string,
      data: null,
    });
  }
  next();
};

export default validation;
