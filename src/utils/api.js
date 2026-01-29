import { request } from "./request";

/* ======================
   CHILDREN API
====================== */
export const ChildrenAPI = {
  fetchAll: (churchId) =>
    request(`/children?churchId=${encodeURIComponent(churchId)}`),
  add: (childData) =>
    request("/children", { method: "POST", body: JSON.stringify(childData) }),
  update: (id, childData) =>
    request(`/children/${id}`, { method: "PUT", body: JSON.stringify(childData) }),
  delete: (id) =>
    request(`/children/${id}`, { method: "DELETE" }),
};

/* ======================
   PROFILE API
====================== */
export const ProfileAPI = {
  get: () => request("/profile"),
  update: (updates) => request("/profile", { method: "PUT", body: JSON.stringify(updates) }),
};

/* ======================
   MEMBERS API
====================== */
export const MembersAPI = {
  fetchAll: (department = "") =>
    request(department ? `/members?department=${encodeURIComponent(department)}` : "/members"),
  create: (payload) =>
    request("/members", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, updates) =>
    request(`/members/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  remove: (id) =>
    request(`/members/${id}`, { method: "DELETE" }),
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
    request("/treasury/transactions", { method: "POST", body: JSON.stringify(payload) }),
};

/* ======================
   AUTH API
====================== */
export const AuthAPI = {
  me: () => request("/auth/me"),
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  callback: ({ access_token, refresh_token, type }) =>
    request(`/auth/callback?access_token=${access_token}&refresh_token=${refresh_token}&type=${type}`),
  resendVerification: (email) =>
    request("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (email) =>
    request("/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPasswordConfirm: ({ token, newPassword }) =>
    request("/auth/reset-password-confirm", { method: "POST", body: JSON.stringify({ token, newPassword }) }),
};

/* ======================
   ATTENDANCE API
====================== */
export const AttendanceAPI = {
  fetchAll: (params = "") => request(`/attendance${params}`),
  mark: (payload) => request("/attendance", { method: "POST", body: JSON.stringify(payload) }),
};

/* ======================
   ANNOUNCEMENTS / COMMUNICATION API
====================== */
export const AnnouncementsAPI = {
  fetch: (churchId, limit = 5) =>
    request(`/dashboard/announcements?churchId=${churchId}&limit=${limit}`),
  create: (payload) =>
    request("/dashboard/announcements", { method: "POST", body: JSON.stringify(payload) }),
  remove: (id) => request(`/dashboard/announcements/${id}`, { method: "DELETE" }),
};

export const CommunicationAPI = {
  fetchAnnouncements: (churchId) => AnnouncementsAPI.fetch(churchId),
  addAnnouncement: (payload) => AnnouncementsAPI.create(payload),
  deleteAnnouncement: (id) => AnnouncementsAPI.remove(id),
};

/* ======================
   DASHBOARD API
====================== */
export const DashboardAPI = {
  dailyVerse: async () => {
    try {
      return await request("/dashboard/daily-verse");
    } catch {
      return {
        reference: "Psalm 118:24",
        text: "This is the day the Lord has made; let us rejoice and be glad in it.",
      };
    }
  },
  myBirthday: async () => {
    try {
      return await request("/dashboard/my-birthday");
    } catch {
      return { fullName: "Child of God", isBirthday: false };
    }
  },
  todaysBirthdays: async (churchId) => {
    try {
      return churchId
        ? await request(`/dashboard/todays-birthdays?church_id=${churchId}`)
        : await request("/dashboard/todays-birthdays");
    } catch {
      return [];
    }
  },
};

/* ======================
   OVERVIEW / ADMIN API
====================== */
export const OverviewAPI = {
  admin: () => request("/admin/overview"),
  fetchPastorOverview: () => request("/pastor/overview"),
};

/* ======================
   ADMIN API
====================== */
export const AdminAPI = {
  pendingRoleRequestsCount: () => request("/admin/role-requests/pending-count"),
  fetchRoleRequests: () => request("/admin/role-requests"),
  approveRoleRequest: (requestId) => request(`/admin/role-requests/${requestId}/approve`, { method: "POST" }),
  rejectRoleRequest: (requestId) => request(`/admin/role-requests/${requestId}/reject`, { method: "POST" }),
  fetchMembers: (params = "") => request(`/admin/members?${params}`),
  updateMemberRole: (memberId, roleId) =>
    request(`/admin/members/${memberId}/role`, { method: "PUT", body: JSON.stringify({ role_id: roleId }) }),
  deactivateMember: (memberId) =>
    request(`/admin/users/${memberId}/deactivate`, { method: "POST" }),
};

/* ======================
   ROLE REQUESTS API
====================== */
export const RoleRequestsAPI = {
  submit: ({ target_user_id, requested_role }) =>
    request("/role-requests", { method: "POST", body: JSON.stringify({ target_user_id, requested_role }) }),
  fetchPending: () => request("/admin/role-requests"),
  approve: (requestId) => request(`/admin/role-requests/${requestId}/approve`, { method: "POST" }),
  reject: (requestId) => request(`/admin/role-requests/${requestId}/reject`, { method: "POST" }),
  pendingCount: () => request("/admin/role-requests/pending-count"),
  fetchMyRequests: () => request("/role-requests/my"), // for member view
};

/* ======================
   LEGACY / HELPER EXPORTS
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = (churchId) => AnnouncementsAPI.fetch(churchId);
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = (churchId) => DashboardAPI.todaysBirthdays(churchId);
