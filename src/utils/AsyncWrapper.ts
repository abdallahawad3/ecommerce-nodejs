import type { Request, Response, NextFunction } from "express";
export const asyncWrapper = (
  asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFn(req, res, next).catch((error) => next(error));
  };
};
