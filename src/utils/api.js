import { request } from "./request";
const buildQuery = (filters = {}) => {

  const params =
    new URLSearchParams();

  Object.entries(filters)
    .forEach(([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(
          key,
          value
        );
      }

    });

  return params.toString();
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
  fetchAll: ({
    departmentId,
    search,
  } = {}) => {
    const params = new URLSearchParams();

    if (departmentId) {
      params.set(
        "department",
        departmentId
      );
    }

    if (search?.trim()) {
      params.set(
        "search",
        search.trim()
      );
    }

    const query = params.toString();

    return request(
      query
        ? `/members?${query}`
        : "/members"
    );
  },

  addToDepartment: (payload) =>
    request("/members", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  remove: (payload) =>
    request("/members", {
      method: "DELETE",
      body: JSON.stringify(payload),
    }),
};

/* ======================
   DEPARTMENTS API
====================== */

export const DepartmentsAPI = {
  fetch: async (filters = {}) => {
    const query = buildQuery(filters);

    const url = `/reusables/departments${
      query ? `?${query}` : ""
    }`;

    const response = await request(url);

    console.log(
      "Departments response:",
      response
    );

    return response;
  },

  fetchById: (id) =>
    request(`/reusables/departments/${id}`),
};

/* ======================
   TREASURY API
====================== */

export const TreasuryAPI = {

  /* Dashboard */

  overview(filters = {}) {
    const query = buildQuery(filters);

    return request(
      `/treasury/overview${
        query ? `?${query}` : ""
      }`
    );
  },

  /* Funds */

  createFund(payload) {
    return request(
      "/treasury/funds",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  funds(filters = {}) {
    const query = buildQuery(filters);

    return request(
      `/treasury/funds${
        query ? `?${query}` : ""
      }`
    );
  },

  fundsSummary(filters = {}) {
    const query = buildQuery(filters);

    return request(
      `/treasury/funds/summary${
        query ? `?${query}` : ""
      }`
    );
  },

  /* Remittances */
 remittances: (filters = {}) => {
  const query = buildQuery(filters);

  return request(
    `/treasury/funds/remittances${
      query ? `?${query}` : ""
    }`
  );
},

  remitFunds(payload) {
    return request(
      "/treasury/funds/remit",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  cancelRemittance(remittanceId) {
    return request(
      `/treasury/funds/remit/${remittanceId}/cancel`,
      {
        method: "PATCH",
      }
    );
  },

  /* Transactions */

  transactions(filters = {}) {
    const query = buildQuery(filters);

    return request(
      `/treasury/transactions${
        query ? `?${query}` : ""
      }`
    );
  },

  createTransaction(payload) {
    return request(
      "/treasury/transactions",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /* Member Giving */

/* Logged-in member */
myGivingLedger(filters = {}) {

  const query =
    buildQuery(filters);

  return request(
    `/treasury/me/ledger${
      query ? `?${query}` : ""
    }`
  );

},

/* Treasurer/Admin */
memberGivingLedger(
  memberId,
  filters = {}
) {

  const query =
    buildQuery(filters);

  return request(
    `/treasury/members/${memberId}/ledger${
      query ? `?${query}` : ""
    }`
  );

},

};
export const ClerkAPI = {
  /* -------------------------
     MEMBERS
  -------------------------- */
  getMembers: (params = "") =>
    request(`/clerk/members${params}`),

  overview: () =>
    request("/clerk/overview"),

  addMember: (payload) =>
    request("/clerk/add-member", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMember: (memberId, payload) =>
    request(`/clerk/members/${memberId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /* -------------------------
     CHILDREN
  -------------------------- */
  getChildren: (params = "") =>
    request(`/clerk/children${params}`),

  addChild: (payload) =>
    request("/clerk/add-child", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateChild: (childId, payload) =>
    request(`/clerk/children/${childId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  searchParents: (query) =>
    request(
      `/clerk/search-parents?q=${encodeURIComponent(query)}`
    ),

  /* -------------------------
     TRANSFERS
  -------------------------- */
  getSourceTransfers: (params = "") =>
    request(`/clerk/transfers/source${params}`),

  getDestinationTransfers: (params = "") =>
    request(`/clerk/transfers/destination${params}`),

  getTransferHistory: (params = "") =>
    request(`/clerk/transfers/history${params}`),

  createTransfer: (payload) =>
    request(`/clerk/transfers/create`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* -------------------------
     WORKFLOW ACTIONS
  -------------------------- */
  approveTransfer: (transferId, payload = {}) =>
    request(`/clerk/transfers/${transferId}/approve`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  rejectTransfer: (transferId, payload = {}) =>
    request(`/clerk/transfers/${transferId}/reject`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /* -------------------------
     REPORTS
  -------------------------- */

generateReport: async (params) => {
  const query = new URLSearchParams({
    ...params,
    format: "json",
  }).toString();

  return request(`/clerk/reports/summary?${query}`, {
    method: "GET",
  });
},

downloadReport: async (params) => {
    const query = new URLSearchParams({
      ...params,
      format: "pdf",
    }).toString();

    return request(
      `/clerk/reports/summary?${query}`,
      {
        method: "GET",
        credentials: "include",           
      }
    );
  },
};
/* ======================
   AUTH API
====================== */
export const AuthAPI = {
  me: () => request("/auth/me"),
 
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
 
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
 
  resendVerification: (email) =>
    request("/auth/verification/resend", { method: "POST", body: JSON.stringify({ email }) }),
 
  resetPassword: (email) =>
    request("/auth/password/reset", { method: "POST", body: JSON.stringify({ email }) }),
  changePassword: (newPassword) =>
    request("/auth/password/change", { method: "POST", body: JSON.stringify({ newPassword }) }),

  getConferences: () => request("/reusables/conferences"),
};

/* ======================
   ATTENDANCE API
====================== */

export const AttendanceAPI = {
  fetch: ({
    departmentId,
    attendanceDate,
  } = {}) => {
    const params = new URLSearchParams();

    if (departmentId) {
      params.set(
        "departmentId",
        departmentId
      );
    }

    if (attendanceDate) {
      params.set(
        "attendanceDate",
        attendanceDate
      );
    }

    const query = params.toString();

    return request(
      query
        ? `/attendance?${query}`
        : "/attendance"
    );
  },

  save: (payload) =>
    request("/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  summary: ({
    departmentId,
    period,
  } = {}) => {
    const params = new URLSearchParams();

    if (departmentId) {
      params.set(
        "departmentId",
        departmentId
      );
    }

    if (period) {
      params.set(
        "period",
        period
      );
    }

    const query = params.toString();

    return request(
      query
        ? `/attendance/summary?${query}`
        : "/attendance/summary"
    );
  },
};
/* ======================
   SABBATH SCHOOL API
====================== */

export const SabbathSchoolAPI = {
  /* Lesson Guides */

  getLessonGuides() {
    return request(
      "/sabbath-school/lesson-guides"
    );
  },

  createLessonGuide(data) {
  return request(
    "/sabbath-school/lesson-guides",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
},

createMyLessonGuide(data) {
  return request(
    "/sabbath-school/lesson-guides/me",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
},

  updateLessonGuide(id, data) {
    return request(
      `/sabbath-school/lesson-guides/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteLessonGuide(id) {
    return request(
      `/sabbath-school/lesson-guides/${id}`,
      {
        method: "DELETE",
      }
    );
  },

 /* Attendance */

getAttendance(departmentId) {
  return request(
    `/sabbath-school/${departmentId}/attendance`
  );
},

saveAttendance(departmentId, data) {
  return request(
    `/sabbath-school/${departmentId}/attendance`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
},

  deleteAttendance(sessionId) {
    return request(
      `/attendance/${sessionId}`,
      {
        method: "DELETE",
      }
    );
  },
  /* Offerings */

getOfferings(departmentId) {
  return request(
    `/sabbath-school/${departmentId}/finances`
  );
},

saveOfferings(departmentId, data) {
  return request(
    `/sabbath-school/finances`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
},

deleteOfferings(sessionId) {
  return request(
    `/finances/${sessionId}`,
    {
      method: "DELETE",
    }
  );
},
};
/* ======================
   ANNOUNCEMENTS / COMMUNICATION API
====================== */
export const AnnouncementsAPI = {
  fetchChurch(limit = 5) {
    return request(
      `/announcements/church?limit=${limit}`
    );
  },

  fetchMyDepartments(
    limit = 5
  ) {
    return request(
      `/announcements/departments/mine?limit=${limit}`
    );
  },

  createChurch(payload) {
    return request(
      "/announcements/church",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  createDepartment(
    departmentId,
    payload
  ) {
    return request(
      `/announcements/departments/${departmentId}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  deleteChurch(announcementId) {
    return request(
      `/announcements/church/${announcementId}`,
      {
        method: "DELETE",
      }
    );
  },

  deleteDepartment(
    departmentId,
    announcementId
  ) {
    return request(
      `/announcements/departments/${departmentId}/${announcementId}`,
      {
        method: "DELETE",
      }
    );
  },
};
/* ======================
   DASHBOARD API
====================== */
export const DashboardAPI = {
  dailyVerse: async () => {
    try { return await request("/dashboard/daily/verse"); }
    catch { return { reference: "Psalm 118:24", text: "This is the day the Lord has made; let us rejoice and be glad in it." }; }
  },
  myBirthday: async () => {
    try { return await request("/dashboard/birthdays/mine"); }
    catch { return { full_name: "Child of God", birthday: null, isBirthday: false }; }
  },
  todaysBirthdays: async (churchId) => {
    try { return churchId ? await request(`/dashboard/birthdays/today?church_id=${churchId}`) : await request("/dashboard/todays-birthdays"); }
    catch { return []; }
  },
  upcomingBirthdays: async (churchId, daysAhead = 30) => {
    try { return churchId ? await request(`/dashboard/birthdays/upcoming?church_id=${churchId}&days=${daysAhead}`) : []; }
    catch { return []; }
  },
};

/* ======================
    OVERVIEW API
====================== */
export const OverviewAPI = {
  fetchPastorOverview: () => request("/pastor/dashboard"),
};

/* ======================
   ADMIN API
====================== */
export const AdminAPI = {
  fetchMembers: () => request("/admin/members"),

  updateMemberRoles: async ({memberId, roles}) =>
  request(`/admin/roles/${memberId}/update`, {
    method: "PUT",
    body: JSON.stringify({
      roles
    }),
  }),

  searchProfiles: (query) =>
    request(`/members/profiles/search?q=${encodeURIComponent(query)}`),

suspendMember: ({memberId, reason}) =>
  request(`/admin/members/${memberId}?action=suspend`, {
    method: "POST",
    body: JSON.stringify({reason}),
  }),

unsuspendMember: ({memberId}) =>
  request(`/admin/members/${memberId}?action=activate`, {
    method: "POST",
  }),
};
/* ======================
   ROLE REQUESTS API
====================== */
export const RoleRequestsAPI = {
  submit: (requested_role) =>
    request("/role-requests", { method: "POST", body: JSON.stringify({ requested_role })}),
  fetchPending: () => request("/role-requests"),
  reviewRoleRequest: (requestId, action) => request(`/role-requests/${requestId}/review`, { method: "POST", body: JSON.stringify({action}) }),
  pendingCount: () => request("/role-requests/pending/count"),
  fetchMyRequests: () => request("/role-requests/mine"),
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
  myRequests: () =>
    request("/membership-requests/me"),
};


/* ======================
   ADMIN MEMBERSHIP API
====================== */
export const AdminMembershipAPI = {
  // Get all pending user requests
  fetchAll: () =>
    request("/membership-requests"),

  // Review (approve / reject) request
  review: (requestId, action) =>
    request(`/membership-requests/${requestId}/review`, {
      method: "POST",
      body: JSON.stringify({ action }), // "approved" | "rejected"
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
    request(`/notifications/read/${id}`, { method: "PATCH" }),

  // Mark all notifications as read
  markAllAsRead: () =>
    request("/notifications/read", { method: "PATCH" }),
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
   CHURCH API
====================== */
export const ChurchAPI = {
  getById: (id) => request(`/reusables/church/${id}`),

  /* -------------------------
     SEARCH CHURCHES
  ------------------------- */
  getChurches: (params = {}) => {
  const searchParams =
    new URLSearchParams();

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParams.append(
          key,
          value
        );
      }
    }
  );

  return request(
    `/reusables/churches?${searchParams.toString()}`
  );
},

  /* -------------------------
     CREATE CHURCH
  ------------------------- */
  createChurch: ({ church_name, conference_id }) =>
    request("/reusables/church", {
      method: "POST",
      body: JSON.stringify({
        church_name,
        conference_id,
      }),
    }),

  /* -------------------------
     SET ACTIVE CHURCH
  ------------------------- */
  setActiveChurch: ({ church_id }) =>
    request("/reusables/switch-church", {
      method: "POST",
      body: JSON.stringify({
        church_id,
      }),
    }),
};
/* ======================
   ROLES API
====================== */
export const RolesAPI = {
  getAll: () => request("/reusables/roles"),
};
/* ======================
   LEGACY / HELPERS
====================== */
export const getDailyVerse = () => DashboardAPI.dailyVerse();
export const getAnnouncements = (churchId) => AnnouncementsAPI.fetch(churchId);
export const getMyBirthday = () => DashboardAPI.myBirthday();
export const getTodaysBirthdays = (churchId) => DashboardAPI.todaysBirthdays(churchId);
export const getUpcomingBirthdays = (churchId, daysAhead = 30) => DashboardAPI.upcomingBirthdays(churchId, daysAhead);
