import { express } from "express";
import User from "../../models/users.model.js";

declare module "express" {
  interface Request {
    filterObject?: object;
    user?: User.default;
  }
}
