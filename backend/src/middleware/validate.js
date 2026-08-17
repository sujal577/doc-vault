import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export function validateObjectId(paramName = "id", source = "params") {
  return (req, _res, next) => {
    const value = source === "query" ? req.query[paramName] : req.params[paramName];

    if (!value) {
      return next(new ApiError(400, `${paramName} is required`));
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
      return next(new ApiError(400, `Invalid ${paramName}`));
    }

    next();
  };
}

export function requireBodyFields(...fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return next(new ApiError(400, `Missing required fields: ${missing.join(", ")}`));
    }

    next();
  };
}

export function requireQueryFields(...fields) {
  return (req, _res, next) => {
    const missing = fields.filter((field) => {
      const value = req.query[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return next(new ApiError(400, `Missing required query parameters: ${missing.join(", ")}`));
    }

    next();
  };
}
