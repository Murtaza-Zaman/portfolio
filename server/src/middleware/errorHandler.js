import { logApiError } from "../config/logger/index.js";

export function notFoundHandler(request, response) {
  response.status(404).json({
    data: null,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
}

export function errorHandler(error, request, response, _next) {
  const status = error.name === "ZodError" ? 400 : error.statusCode ?? 500;
  const code = error.name === "ZodError" ? "VALIDATION_ERROR" : error.code ?? "INTERNAL_ERROR";
  const details = error.name === "ZodError" ? error.issues : undefined;

  if (status >= 500) {
    logApiError(error, request);
  }

  response.status(status).json({
    data: null,
    error: { code, message: status >= 500 ? "Internal server error" : error.message, details },
  });
}

