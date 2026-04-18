import type { ERRORS_NAMES } from "../types/errorsName.js";

class AppError extends Error {
  cause?: {
    code?: number;
    keyValue?: any;
    [key: string]: any;
  };

  public statusCode: number;
  public status: string;
  constructor(message: string, statusCode: number, name: ERRORS_NAMES = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.name = name;
  }
}
export default AppError;
