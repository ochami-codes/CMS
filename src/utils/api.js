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
  delete: (id) => request(`/children/${id}`, { method: "DELETE" }),
};

/* ======================
   PROFILE API
====================== */
export const ProfileAPI = {
  get: () => request("/profile"),
  update: (updates) =>
    request("/profile", { method: "PUT", body: JSON.stringify(updates) }),
};

/* ======================
   MEMBERS API
====================== */
export const MembersAPI = {
  fetchAll: (department = "") =>
    request(department ? `/members?department=${encodeURIComponent(department)}` : "/members"),
  add: (payload) => request("/members", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, updates) => request(`/members/${id}`, { method: "PUT", body: JSON.stringify(updates) }),
  remove: (id) => request(`/members/${id}`, { method: "DELETE" }),
};

/* ======================
   DEPARTMENTS API
====================== */
export const DepartmentsAPI = {
  fetchAll: () => request("/departments"),
  fetchById: (id) => request(`/departments/${id}`),
};

/* ======================
   TREASURY API
====================== */
export const TreasuryAPI = {
  overview: (params = "") => request(`/treasury/overview${params}`),
  fundGroups: (params = "") => request(`/treasury/fund-groups${params}`),
  fundsByGroup: (groupId, params = "") => request(`/treasury/fund-groups/${groupId}/funds${params}`),
  memberGivingSummary: (params = "") => request(`/treasury/member-giving-summary${params}`),
  createTransaction: (payload) => request("/treasury/transactions", { method: "POST", body: JSON.stringify(payload) }),
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
  changePassword: (newPassword) =>
    request("/auth/change-password", { method: "POST", body: JSON.stringify({ newPassword }) }),
getConferences: () => request("/conferences"),
};

/* ======================
   ATTENDANCE API
====================== */
export const AttendanceAPI = {
  fetch: (department, date) =>
    request(`/attendance?department=${encodeURIComponent(department)}&date=${date}`),
  save: (records) =>
    request("/attendance", { method: "POST", body: JSON.stringify({ records }) }),
  summary: (department, period) =>
    request(`/attendance/summary?department=${encodeURIComponent(department)}&period=${period}`),
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
    try { return await request("/dashboard/daily-verse"); }
    catch { return { reference: "Psalm 118:24", text: "This is the day the Lord has made; let us rejoice and be glad in it." }; }
  },
  myBirthday: async () => {
    try { return await request("/dashboard/my-birthday"); }
    catch { return { full_name: "Child of God", birthday: null, isBirthday: false }; }
  },
  todaysBirthdays: async (churchId) => {
    try { return churchId ? await request(`/dashboard/todays-birthdays?church_id=${churchId}`) : await request("/dashboard/todays-birthdays"); }
    catch { return []; }
  },
  upcomingBirthdays: async (churchId, daysAhead = 30) => {
    try { return churchId ? await request(`/dashboard/upcoming-birthdays?church_id=${churchId}&days=${daysAhead}`) : []; }
    catch { return []; }
  },
};

/* ======================
   ADMIN / OVERVIEW API
====================== */
export const OverviewAPI = {
  admin: () => request("/admin/overview"),
  fetchPastorOverview: () => request("/pastor/overview"),
};

/* ======================
   ADMIN API
====================== */
export const AdminAPI = {
  fetchMembers: (params = "") => request(`/members?${params}`),

  updateMemberRole: async (memberId, roleName) =>
  request(`/admin/role-requests/members/${memberId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role_name: roleName }),
  }),

  searchProfiles: (query) =>
    request(`/members/profiles/search?q=${encodeURIComponent(query)}`),

  deactivateMember: (memberId) =>
    request(`/admin/users/${memberId}/deactivate`, { method: "POST" }),

  activateMember: (memberId) =>
    request(`/admin/users/${memberId}/activate`, { method: "POST" }),

  fetchRoleRequests: () => request("/admin/role-requests"),
  approveRoleRequest: (id) =>
    request(`/admin/role-requests/${id}/approve`, { method: "POST" }),
  rejectRoleRequest: (id) =>
    request(`/admin/role-requests/${id}/reject`, { method: "POST" }),

  /* -------- NEW: Non-members API -------- */
  fetchNonMembers: () => request("/admin/membership-requests/non-members"),

  /* -------- NEW: Invite API -------- */
  sendInvite: (id, payload) =>
    request(`/admin/membership-requests/invite/${id}`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    }),
};
/* ======================
   ROLE REQUESTS API
====================== */
export const RoleRequestsAPI = {
  submit: (requested_role) =>
    request("/role-requests", { method: "POST", body: JSON.stringify({ requested_role }), headers: { "Content-Type": "application/json" } }),
  fetchPending: () => request("/admin/role-requests"),
  approve: (id) => request(`/admin/role-requests/${id}/approve`, { method: "POST" }),
  reject: (id) => request(`/admin/role-requests/${id}/reject`, { method: "POST" }),
  pendingCount: () => request("/admin/role-requests/pending-count"),
  fetchMyRequests: () => request("/role-requests/my-requests"),
};

/* ======================
   MEMBERSHIP API
====================== */
export const MembershipAPI = {
  // Submit membership request (user → church)
  submit: () =>
    request("/membership-requests", {
      method: "POST",
    }),

  // Get my latest membership request
  myRequest: () =>
    request("/membership-requests/me"),

  // Respond to an invite (accept / reject)
  respondInvite: (requestId, action) =>
    request(`/membership-requests/${requestId}/respond`, {
      method: "PATCH",
      body: JSON.stringify({ action }), // "accepted" | "rejected"
    }),
};


/* ======================
   ADMIN MEMBERSHIP API
====================== */
export const AdminMembershipAPI = {
  // Get all pending user requests
  fetchAll: () =>
    request("/admin/membership-requests"),

  // Review (approve / reject) request
  review: (requestId, action) =>
    request(`/admin/membership-requests/${requestId}/review`, {
      method: "POST",
      body: JSON.stringify({ action }), // "approved" | "rejected"
    }),

  // Invite user to church
  invite: (profileId) =>
    request(`/admin/membership-requests/invite/${profileId}`, {
      method: "POST",
    }),
};
/* ======================
   NOTIFICATIONS API
====================== */
export const NotificationsAPI = {
  // Fetch paginated notifications
  getAll: ({ page = 1, limit = 10 } = {}) =>
    request(`/notifications?page=${page}&limit=${limit}`),

  // Get unread count only (for bell badge)
  getUnreadCount: () =>
    request("/notifications/unread-count"),

  // Mark a single notification as read
  markAsRead: (id) =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  // Mark all notifications as read
  markAllAsRead: () =>
    request("/notifications/read-all", { method: "PATCH" }),
};
/* ======================
   MESSAGES API
====================== */
export const MessagesAPI = {
  //  Get inbox (list of conversations)
  getInbox: () => request("/messages/inbox"),

  //  Get a single conversation/thread
  getConversation: (threadId) =>
    request(`/messages/conversation/${threadId}`),

  //  Check if a thread already exists between two users
  getThreadWith: (userId) =>
    request(`/messages/thread-with/${userId}`),

  //  Badge counts
  getUnreadCount: () =>
    request("/messages/unread-count"),

  //  Get users (leaders + members)
  getUsers: () =>
    request("/messages/users"),

  //  Send message
  send: ({ content, thread_id, recipient_profile_id }) => {
    if (!thread_id && !recipient_profile_id) {
      throw new Error("Invalid message payload");
    }

    return request("/messages", {
      method: "POST",
      body: JSON.stringify({
        content,
        thread_id,
        recipient_profile_id,
      }),
    });
  },

  //  Mark thread as read
  markAsRead: (threadId) =>
    request("/messages/read", {
      method: "POST",
      body: JSON.stringify({
        thread_id: threadId,
      }),
    }),
};
/* ======================
   ADMIN DASHBOARD API
====================== */
export const AdminDashboardAPI = {
  fetchAll: () => request("/admin/dashboard"),
};

/* ======================
   CHURCH API
====================== */
export const ChurchAPI = {
  getById: (id) => request(`/churches/${id}`),
};
/* ======================
   ROLES API
====================== */
export const RolesAPI = {
  getAll: () => request("/roles"),
};
/* ======================
   LEGACY / HELPERS
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = (churchId) => AnnouncementsAPI.fetch(churchId);
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = (churchId) => DashboardAPI.todaysBirthdays(churchId);
export const getUpcomingBirthdays = (churchId, daysAhead = 30) => DashboardAPI.upcomingBirthdays(churchId, daysAhead);
