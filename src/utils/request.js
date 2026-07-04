const API_URL = import.meta.env.VITE_API_URL;

export async function request(endpoint, options = {}, skipAuth = false) {
  const token = !skipAuth ? localStorage.getItem("access_token") : null;

  const isFormData = options.body instanceof FormData;
  const isStringBody = typeof options.body === "string";

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body:
      options.body && !isFormData && !isStringBody
        ? JSON.stringify(options.body)
        : options.body,
  });

  const contentType = res.headers.get("content-type");

  // 🚨 HANDLE PDF
  if (contentType?.includes("application/pdf")) {
    if (!res.ok) throw new Error("PDF request failed");
    return await res.blob();
  }

  // 🚨 HANDLE BINARY
  if (contentType?.includes("application/octet-stream")) {
    if (!res.ok) throw new Error("Binary request failed");
    return await res.blob();
  }

  // ✅ SAFE JSON PARSING
  let data = null;

  try {
    data = await res.json();
  } catch {
    // response might be empty (204) or non-JSON
  }

  // ❌ ERROR HANDLING
  if (!res.ok) {
    throw {
      status: res.status,
      message:
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`,
      data,
    };
  }

  return data?.data ?? data;
}