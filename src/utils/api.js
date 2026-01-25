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
  // GET /members?department=Youth
  fetchAll: (department = "") =>
    request(
      department
        ? `/members?department=${encodeURIComponent(department)}`
        : "/members"
    ),

  // POST /members
  add: (formData) =>
    request("/members", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  // PUT /members/:id
  update: (id, updates) =>
    request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify({ updates }),
    }),

  // DELETE /members/:id
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
   AUTH API
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
   ADMIN API
====================== */
export const AdminAPI = {
  pendingRoleRequestsCount: () =>
    request("/admin/role-requests/pending-count"),

  fetchRoleRequests: () =>
    request("/admin/role-requests"),

  approveRoleRequest: (requestId) =>
    request(`/admin/role-requests/${requestId}/approve`, {
      method: "POST",
    }),

  rejectRoleRequest: (requestId) =>
    request(`/admin/role-requests/${requestId}/reject`, {
      method: "POST",
    }),

  // GET /admin/members
  fetchMembers: (params = "") =>
    request(`/admin/members?${params}`),

  // PUT /admin/members/:id/role
  updateMemberRole: (memberId, roleId) =>
    request(`/admin/members/${memberId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role_id: roleId }),
    }),

  // POST /admin/users/:id/deactivate
  deactivateMember: (memberId) =>
    request(`/admin/users/${memberId}/deactivate`, {
      method: "POST",
    }),
};

/* ======================
   LEGACY EXPORTS
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = () => DashboardAPI.announcements();
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = () => DashboardAPI.todaysBirthdays();
