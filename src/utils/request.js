// src/utils/request.js
const API_URL = import.meta.env.VITE_API_URL;

export async function request(
  endpoint,
  options = {}
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}
