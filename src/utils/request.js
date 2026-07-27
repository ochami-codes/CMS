import { handleApiError } from "../errors/errorHandler";

const API_URL = import.meta.env.VITE_API_URL;

export async function request(
  endpoint,
  options = {},
  skipAuth = false
) {
  const token = !skipAuth
    ? localStorage.getItem("access_token")
    : null;

  const isFormData =
    options.body instanceof FormData;

  const isStringBody =
    typeof options.body === "string";

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        }),
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
      body:
        options.body &&
        !isFormData &&
        !isStringBody
          ? JSON.stringify(options.body)
          : options.body,
    }
  );

  const contentType =
    res.headers.get("content-type");

  // PDF
  if (
    contentType?.includes(
      "application/pdf"
    )
  ) {
    if (!res.ok) {
      throw handleApiError({
        status: res.status,
        message: "PDF request failed.",
      });
    }

    return await res.blob();
  }

  // Binary
  if (
    contentType?.includes(
      "application/octet-stream"
    )
  ) {
    if (!res.ok) {
      throw handleApiError({
        status: res.status,
        message: "Binary request failed.",
      });
    }

    return await res.blob();
  }

  // JSON
  let data = null;

  try {
    data = await res.json();
  } catch {
    // Empty or non-JSON response
  }

  // API error
  if (!res.ok) {
    throw handleApiError({
      status: res.status,
      message:
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`,
      code: data?.code,
      data,
    });
  }

  return data?.data ?? data;
}