import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const deleteOne = (Model: any) => asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("The document ID is required", "BAD_REQUEST_ERROR");
    }

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      throw new NotFoundError(`Document for the given ID:${id} not found`, "NOT_FOUND_ERROR");
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);

export const updateOne = (Model: any) => asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("The document ID is required", "BAD_REQUEST_ERROR");
    }

    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      select: "-__v",
    });
    if (!document) {
      throw new NotFoundError(`Document for the given ID:${id} not found`, "NOT_FOUND_ERROR");
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  },
);
  