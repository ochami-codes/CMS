// src/config/roles.js

export const ROLE_PERMISSIONS = {
  admin: [
    "access_admin_dashboard",
    "access_pastor_dashboard",
    "access_youth_dashboard",
    "access_children_dashboard",
    "access_treasury_dashboard",
    "access_deaconry_dashboard",
    "access_choir_dashboard",
    "access_amo_dashboard",
    "access_alo_dashboard",
    "access_clerk_dashboard",
    "access_s_school_dashboard",
    "access_media_dashboard",
  ],

  pastor: [
    "access_pastor_dashboard",
    "access_media_dashboard",
  ],

  treasurer: [
    "access_treasury_dashboard",
  ],

  youth_leader: [
    "access_youth_dashboard",
    "manage_youth",
  ],

  children_leader: [
    "access_children_dashboard",
    "manage_children",
  ],

  communication_leader: [
    "access_media_dashboard",
  ],

  choir_leader: [
    "access_choir_dashboard",
  ],

  s_school_leader: [
    "access_s_school_dashboard",
  ],

  clerk: [
    "access_clerk_dashboard",
  ],

  amo_leader: [
    "access_amo_dashboard",
  ],

  alo_leader: [
    "access_alo_dashboard",
  ],

  deaconry_leader: [
    "access_deaconry_dashboard",
  ],

  member: [
    "access_dashboard",
    "view_content",
  ],
};


// ✅ Roles config (keys MUST match DB exactly)
export const ROLES = {
  admin: { label: "Admin" },
  pastor: { label: "Pastor" },
  treasurer: { label: "Treasurer" },
  youth_leader: { label: "Youth Leader" },
  children_leader: { label: "Children Leader" },
  communication_leader: { label: "Communication Leader" },
  choir_leader: { label: "Choir Leader" },
  amo_leader: { label: "AMO Leader" },
  alo_leader: { label: "ALO Leader" },
  deaconry_leader: { label: "Deaconry Leader" },
  clerk: { label: "Church Clerk" },
  s_school_leader: { label: "Sabbath School Leader" },
  member: { label: "Member" },
};


// Helpers
export const getRoleLabel = (role) => {
  return ROLES[role]?.label || role;
};

export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
