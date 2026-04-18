import type { ERRORS_NAMES } from "../types/errorsName.js";
import AppError from "./AppErrors.js";

export class NotFoundError extends AppError {
  constructor(message: string, name: ERRORS_NAMES) {
    super(message, 404, name);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", name: ERRORS_NAMES) {
    super(message, 400, name);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", name: ERRORS_NAMES) {
    super(message, 401, name);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", name: ERRORS_NAMES) {
    super(message, 403, name);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error", name: ERRORS_NAMES) {
    super(message, 500, name);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation Error", name: ERRORS_NAMES) {
    super(message, 400, name);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", name: ERRORS_NAMES) {
    super(message, 409, name);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too Many Requests", name: ERRORS_NAMES) {
    super(message, 429, name);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable", name: ERRORS_NAMES) {
    super(message, 503, name);
  }
}

export class CastError extends AppError {
  constructor(message: string = "Invalid ID format", name: ERRORS_NAMES) {
    super(message, 400, name);
    this.name = "CastError";
  }
}
