// errors/errorHandler.js

import { ERROR_MESSAGES } from "./errorMessages.js";

export function handleApiError({
  status,
  message,
  code,
  data = null,
}) {
  const error = new Error(
    ERROR_MESSAGES[code] ||
      message ||
      "Something went wrong. Please try again."
  );

  error.status = status || 500;
  error.code =
    code || "INTERNAL_SERVER_ERROR";
  error.data = data;

  return error;
}