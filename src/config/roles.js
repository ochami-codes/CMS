// src/config/roles.js

export const ROLE_PERMISSIONS = {
  Admin: [
    "access_admin_dashboard",
    "access_pastor_dashboard",
    "access_youth_dashboard",
    "access_children_dashboard",
    "access_treasury_dashboard",
    "access_media_dashboard",
  ],

  Pastor: [
    "access_pastor_dashboard",
    "access_media_dashboard",
  ],

  Treasurer: [
    "access_treasury_dashboard",
  ],

  Youth_leader: [
    "access_youth_dashboard",
    "manage_youth",
  ],

  Children_leader: [
    "access_children_dashboard",
    "manage_children",
  ],

  Communication_leader: [
    "access_media_dashboard",
  ],
  Choir_leader: [
"access_choir_dashboard",
],

Amo_leader: [
"access_amo_dashboard",
],

Alo_leader: [
"access_alo_dashboard",
],
Deaconry_leader: [
"access_deaconry_dashboard",
],
  Member: [
    "access_dashboard",
    "view_content",
  ],
};

// src/config/roles.js

export const ROLES = {
  Admin: {
    key: "admin",
    label: "Admin",
  },

  Pastor: {
    key: "pastor",
    label: "Pastor",
  },

  Treasurer: {
    key: "treasurer",
    label: "Treasurer",
  },

  Youth_leader: {
    key: "youthLeader",
    label: "Youth Leader",
  },

  Children_leader: {
    key: "childrenLeader",
    label: "Children Leader",
  },

  Communication_leader: {
    key: "communicationLeader",
    label: "Communication Leader",
  },

  Choir_leader: {
    key: "choirLeader",
    label: "Choir Leader",
  },

  Amo_leader: {
    key: "amoLeader",
    label: "AMO Leader",
  },

  Alo_leader: {
    key: "aloLeader",
    label: "ALO Leader",
  },

  Deaconry_leader: {
    key: "deaconryLeader",
    label: "Deaconry Leader",
  },

  Member: {
    key: "member",
    label: "Member",
  },
};

// Helpers
export const getRoleLabel = (role) => {
  return ROLES[role]?.label || role;
};

export const getRoleKey = (role) => {
  return ROLES[role]?.key || role;
};
