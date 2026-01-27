import { request } from "./request";

/* ======================
   CHILDREN API
====================== */
export const ChildrenAPI = {
  fetchAll: (churchId) =>
    request(`/children?churchId=${encodeURIComponent(churchId)}`),

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
   PROFILE API
====================== */
export const ProfileAPI = {
  get: () => request("/profile"),

  update: (updates) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
};

/* ======================
   MEMBERS API
====================== */
export const MembersAPI = {
  fetchAll: (department = "") =>
    request(
      department
        ? `/members?department=${encodeURIComponent(department)}`
        : "/members"
    ),

  create: (payload) =>
    request("/members", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, updates) =>
    request(`/members/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  remove: (id) =>
    request(`/members/${id}`, {
      method: "DELETE",
    }),
};

/* ======================
   OVERVIEW / ADMIN API
====================== */
export const OverviewAPI = {
  admin: () => request("/admin/overview"),
  pastor: () => request("/pastor/overview"),
};

/* ======================
   TREASURY API
====================== */
export const TreasuryAPI = {
  overview: (params = "") => request(`/treasury/overview${params}`),

  fundGroups: (params = "") => request(`/treasury/fund-groups${params}`),

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

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
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
  fetchAll: (params = "") => request(`/attendance${params}`),

  mark: (payload) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

/* ======================
   ANNOUNCEMENTS API (SOURCE OF TRUTH)
====================== */
export const AnnouncementsAPI = {
  fetch: (churchId, limit = 5) =>
    request(
      `/announcements?churchId=${churchId}&limit=${limit}`
    ),

  create: (payload) =>
    request("/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    request(`/announcements/${id}`, {
      method: "DELETE",
    }),
};

/* ======================
   DASHBOARD API
====================== */
export const DashboardAPI = {
  dailyVerse: () => request("/dashboard/daily-verse"),

  myBirthday: () => request("/dashboard/my-birthday"),

  todaysBirthdays: (churchId) =>
    request(
      churchId
        ? `/dashboard/todays-birthdays?church_id=${churchId}`
        : "/dashboard/todays-birthdays"
    ),
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

  fetchMembers: (params = "") =>
    request(`/admin/members?${params}`),

  updateMemberRole: (memberId, roleId) =>
    request(`/admin/members/${memberId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role_id: roleId }),
    }),

  deactivateMember: (memberId) =>
    request(`/admin/users/${memberId}/deactivate`, {
      method: "POST",
    }),
};

/* ======================
   COMMUNICATION API
====================== */
export const CommunicationAPI = {
  fetchAnnouncements: (churchId) =>
    AnnouncementsAPI.fetch(churchId),

  addAnnouncement: (payload) =>
    AnnouncementsAPI.create(payload),

  deleteAnnouncement: (id) =>
    AnnouncementsAPI.remove(id),
};

/* ======================
   LEGACY EXPORTS (SAFE)
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = (churchId) =>
  AnnouncementsAPI.fetch(churchId);
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = (churchId) =>
  DashboardAPI.todaysBirthdays(churchId);
