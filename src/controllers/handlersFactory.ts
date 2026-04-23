import type { Request, Response, NextFunction } from "express";
import { asyncWrapper } from "../utils/AsyncWrapper.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import ApiFeatures from "../utils/apiFeatures.js";

export const getAll = (Model: any, modeName: string = "") =>
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    let filterObject = {};
    if (req.filterObject) {
      filterObject = req.filterObject;
    }
    // 1) Build the query
    const documentCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObject), req.query)
      .paginate(documentCount)
      .sort()
      .limitFields()
      .search(modeName)
      .filter();

    // 2) Execute the query
    const products = await apiFeatures.mongooseQuery;
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
      pagination: apiFeatures.paginationResult,
    });
  });

export const deleteOne = (Model: any) =>
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
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
  });

export const updateOne = (Model: any) =>
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("The document ID is required", "BAD_REQUEST_ERROR");
    }

    console.log("ID ->", id);

    console.log(req.body);
    const document = await Model.findOneAndUpdate({ _id: id }, req.body, {
      returnDocument: "after",
      select: "-__v",
    });
    if (!document) {
      throw new NotFoundError(`Document for the given ID:${id} not found`, "NOT_FOUND_ERROR");
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });

export const createOne = (Model: any) => {
  return asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: document,
    });
  });
};

export const getOne = (Model: any, populateOptions?: any) => {
  return asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("The document ID is required", "BAD_REQUEST_ERROR");
    }
    let query = Model.findById(id).select("-__v");
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;
    if (!document) {
      throw new NotFoundError(`Document for the given ID:${id} not found`, "NOT_FOUND_ERROR");
    }
    res.status(200).json({
      status: "success",
      data: document,
    });
  });
};
