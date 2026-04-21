import type { Query } from "mongoose";
import type { ParsedQs } from "qs";
import transformQuery from "./transformQuery.js";

class ApiFeatures<T> {
  public mongooseQuery: Query<T[], T>;
  public query: ParsedQs;

  constructor(mongooseQuery: Query<T[], T>, query: ParsedQs) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
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

  search(){
    
    if (this.query.keyword) {
      let query: any = {};
      query.$or = [
        { title: { $regex: this.query.keyword, $options: "i" } },
        { description: { $regex: this.query.keyword, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(){
    const page = parseInt(this.query.page as string) || 1;
    const limit = parseInt(this.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    
    return this;
  }
}

export default ApiFeatures;
