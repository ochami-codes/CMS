const API_URL = import.meta.env.VITE_API_URL;

export async function request(endpoint, options = {}) {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null; // Non-JSON response
    }

    if (!res.ok) {
      throw {
        status: res.status,
        message:
          data?.message ||
          data?.error ||
          `Request failed with status ${res.status}`,
        code: data?.code || null,
        data,
      };
    }

    return data;
  } catch (err) {
    if (err?.status) throw err;
    throw {
      status: 0,
      message: err?.message || "Network error",
      data: null,
    };
  }
}
