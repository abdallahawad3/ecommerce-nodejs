import { express } from "express";

declare module "express" {
  interface Request {
    filterObject?: object;
  }
}
