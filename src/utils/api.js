import { request } from "./request";

/* ======================
   CHILDREN API
====================== */

export const ChildrenAPI = {
  fetchAll: () =>
    request("/children"),

  add: (childData) =>
    request("/children", {
      method: "POST",
      body: JSON.stringify(childData),
    }),

  update: (id, childData) =>
    request(`/children/${id}`, {
      method: "PUT",
      body: JSON.stringify(childData),
    }),

  delete: (id) =>
    request(`/children/${id}`, {
      method: "DELETE",
    }),
};

/* ======================
   MEMBERS API
====================== */

export const MembersAPI = {
  fetchAll: (department) =>
    request(`/members?department=${department}`),

  add: (department, formData) =>
    request("/members", {
      method: "POST",
      body: JSON.stringify({ department, data: formData }),
    }),

  update: (id, formData) =>
    request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    }),

  delete: (id) =>
    request(`/members/${id}`, {
      method: "DELETE",
    }),
};

/* ======================
   OVERVIEW API
====================== */

export const OverviewAPI = {
  fetch: () =>
    request("/admin/overview"),
};

/* ======================
   TREASURY API
====================== */

export const TreasuryAPI = {
  overview: (params = "") =>
    request(`/treasury/overview${params}`),

  fundGroups: (params = "") =>
    request(`/treasury/fund-groups${params}`),

  fundsByGroup: (groupId, params = "") =>
    request(`/treasury/fund-groups/${groupId}/funds${params}`),

  memberGivingSummary: (params = "") =>
    request(`/treasury/member-giving-summary${params}`),

  createTransaction: (payload) =>
    request("/treasury/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

/* ======================
   AUTH API
====================== */

export const AuthAPI = {
  me: () => request("/auth/me"),
  logout: () =>
    request("/auth/logout", { method: "POST" }),
};
