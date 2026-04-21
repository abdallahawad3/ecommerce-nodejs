import type { Query } from "mongoose";
import type { ParsedQs } from "qs";
import transformQuery from "./transformQuery.js";

class ApiFeatures<T> {
  public mongooseQuery: Query<T[], T>;
  public query: ParsedQs;
  public paginationResult: {
    currentPage: number;
    limit: number;
    totalPages?: number;
    next?: number;
    prev?: number;
  };
  constructor(mongooseQuery: Query<T[], T>, query: ParsedQs) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
    this.paginationResult = {
      currentPage: 1,
      limit: 5,
    };
  }

  filter() {
    // 2) Filtering
    const queryObj = { ...this.query };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);
    const parsedQuery = transformQuery(queryObj);
    this.mongooseQuery = this.mongooseQuery.find(parsedQuery);
    return this;
  }

  sort(){
    if (this.query.sort as string) {
      const sortFields = (this.query.sort as string).split(",").join(" ");
      // Sort take the format of "field" for ascending and "-field" for descending and multiple fields can be sorted by separating them with a space
      this.mongooseQuery = this.mongooseQuery.sort(sortFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields(){
    if (this.query.fields as string) {
      const fields = (this.query.fields as string).split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search(modelName:"product" | "brand" | "category" | string){    
    if (this.query.keyword) {
      let query: any = {};
      if(modelName === "product"){
        query.$or = [
          { title: { $regex: this.query.keyword, $options: "i" } },
          { description: { $regex: this.query.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.query.keyword, $options: "i" } },
        ];
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(countPages:number){
    const page = parseInt(this.query.page as string) || 1;
    const limit = parseInt(this.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const endIdx = page * limit;

    const pagination: any = {}

    pagination["currentPage"] = page;
    pagination["limit"] = limit;
    pagination["totalPages"] = Math.ceil(+countPages / limit);

    // next page
    console.log("countPages =>",countPages)
    if (endIdx < countPages) {
      pagination["next"] = page + 1;
    }
    
    // previous page
    if (skip > 0) {
      pagination["prev"] = page - 1;
    }

    this.paginationResult = pagination;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
