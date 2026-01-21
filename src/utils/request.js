const API_URL = import.meta.env.VITE_API_URL;

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  let res;
  let data = null;

  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      // ❌ REMOVED credentials: "include"
    });

    try {
      data = await res.json();
    } catch {
      // Non-JSON response, ignore
    }

    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `Request failed with status ${res.status}`;

      const code = data?.code || null;

      throw {
        status: res.status,
        message,
        code,
        data,
      };
    }

    return data;
  } catch (err) {
    // If it's already a structured error, pass it along
    if (err?.status) throw err;

    // Network or unexpected error (CORS, DNS, HTTPS mismatch, etc.)
    throw {
      status: 0,
      message: err?.message || "Network error",
      data: null,
    };
  }
}
