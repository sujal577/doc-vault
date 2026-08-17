import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  if (err?.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      error: { message },
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      success: false,
      error: { message: "Duplicate entry" },
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
}
