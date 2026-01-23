import { request } from "./request";

/* ======================
   CHILDREN API
====================== */
export const ChildrenAPI = {
  fetchAll: () => request("/children"),

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
   OVERVIEW / ADMIN API
====================== */
export const OverviewAPI = {
  fetch: () => request("/admin/overview"),
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
   AUTH API (CRITICAL FIXES)
====================== */
export const AuthAPI = {
  me: () => request("/auth/me"),

  logout: () =>
    request("/auth/logout", { method: "POST" }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  callback: ({ access_token, refresh_token, type }) =>
    request(
      `/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}&type=${type}`
    ),

  resendVerification: (email) =>
    request("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPasswordConfirm: ({ token, newPassword }) =>
    request("/auth/reset-password-confirm", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    }),
};
/* ======================
   ATTENDANCE API
====================== */
export const AttendanceAPI = {
  fetchAll: (params = "") =>
    request(`/attendance${params}`),

  mark: (payload) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    request(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};

/* ======================
   DASHBOARD API
====================== */
export const DashboardAPI = {
  dailyVerse: () =>
    request("/dashboard/daily-verse"),

  announcements: () =>
    request("/dashboard/announcements"),

  myBirthday: () =>
    request("/dashboard/my-birthday"),

  todaysBirthdays: () =>
    request("/dashboard/todays-birthdays"),
};
/* ======================
   ADMIN DASHBOARD API
====================== */
export const AdminAPI = {
  // Pending role requests count (badge)
  pendingRoleRequestsCount: () =>
    request("/admin/role-requests/pending-count"),

  // Fetch all role requests
  fetchRoleRequests: () =>
    request("/admin/role-requests"),

  // Approve a role request
  approveRoleRequest: (requestId) =>
    request(`/admin/role-requests/${requestId}/approve`, {
      method: "POST",
    }),

  // Reject a role request
  rejectRoleRequest: (requestId) =>
    request(`/admin/role-requests/${requestId}/reject`, {
      method: "POST",
    }),

  // Fetch all members for ManageRoles tab
  fetchMembers: () =>
    request("/admin/members"),

  // Update a member's role
  updateMemberRole: (memberId, roleId) =>
    request(`/admin/members/${memberId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role_id: roleId }),
    }),
};

/* ======================
   LEGACY EXPORTS
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = () => DashboardAPI.announcements();
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = () => DashboardAPI.todaysBirthdays();
