// errors/errorHandler.js

import { ERROR_MESSAGES } from "./errorMessages.js";

export function handleApiError({
type = "API",
status = null,
message,
code,
data = null,
}) {
const errorCode =
code || getErrorCode(type, status);

const error = new Error(
ERROR_MESSAGES[errorCode] ||
message ||
ERROR_MESSAGES.UNKNOWN_ERROR
);

error.type = type;
error.status = status;
error.code = errorCode;
error.data = data;

return error;
}

function getErrorCode(type, status) {
if (type === "NETWORK") {
return "NETWORK_ERROR";
}

if (type === "TIMEOUT") {
return "REQUEST_TIMEOUT";
}

if (type === "CANCELLED") {
return "REQUEST_CANCELLED";
}

const statusCodes = {
400: "BAD_REQUEST",
401: "UNAUTHORIZED",
403: "FORBIDDEN",
404: "NOT_FOUND",
408: "REQUEST_TIMEOUT",
409: "CONFLICT",
422: "VALIDATION_ERROR",
429: "RATE_LIMITED",
500: "INTERNAL_SERVER_ERROR",
502: "BAD_GATEWAY",
503: "SERVICE_UNAVAILABLE",
504: "GATEWAY_TIMEOUT",
};

return (
statusCodes[status] ||
"INTERNAL_SERVER_ERROR"
);
}
