// utils/request.js

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

  const {
    signal: externalSignal,
    ...fetchOptions
  } = options;

  const controller = new AbortController();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener(
        "abort",
        () => controller.abort(),
        { once: true }
      );
    }
  }

  const isFormData =
    fetchOptions.body instanceof FormData;

  const isStringBody =
    typeof fetchOptions.body === "string";

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

    ...(fetchOptions.headers || {}),
  };

  try {
    const res = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...fetchOptions,
        headers,
        signal: controller.signal,

        body:
          fetchOptions.body &&
          !isFormData &&
          !isStringBody
            ? JSON.stringify(
                fetchOptions.body
              )
            : fetchOptions.body,
      }
    );

    const contentType =
      res.headers.get("content-type") ||
      "";

    /*
    ----------------------------------------
    PDF RESPONSE
    ----------------------------------------
    */

    if (
      contentType.includes(
        "application/pdf"
      )
    ) {
      if (!res.ok) {
        throw handleApiError({
          status: res.status,
          message:
            "PDF request failed.",
        });
      }

      return await res.blob();
    }

    /*
    ----------------------------------------
    BINARY RESPONSE
    ----------------------------------------
    */

    if (
      contentType.includes(
        "application/octet-stream"
      )
    ) {
      if (!res.ok) {
        throw handleApiError({
          status: res.status,
          message:
            "Binary request failed.",
        });
      }

      return await res.blob();
    }

    /*
    ----------------------------------------
    JSON RESPONSE
    ----------------------------------------
    */

    let data = null;

    try {
      data = await res.json();
    } catch {
      // Empty or non-JSON response
    }

    /*
    ----------------------------------------
    API ERROR
    ----------------------------------------
    */

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
  } catch (error) {
    /*
    ----------------------------------------
    ALREADY NORMALIZED ERROR
    ----------------------------------------
    */

    if (error?.type || error?.code) {
      throw error;
    }

    /*
    ----------------------------------------
    REQUEST CANCELLED
    ----------------------------------------
    */

    if (error?.name === "AbortError") {
      throw error;
    }

    /*
    ----------------------------------------
    NETWORK ERROR
    ----------------------------------------
    */

    if (error instanceof TypeError) {
      throw handleApiError({
        type: "NETWORK",
        code: "NETWORK_ERROR",
      });
    }

    /*
    ----------------------------------------
    UNKNOWN ERROR
    ----------------------------------------
    */

    throw handleApiError({
      type: "UNKNOWN",
      code: "UNKNOWN_ERROR",
    });
  }
}