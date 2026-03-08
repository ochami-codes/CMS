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

  Member: [
    "access_dashboard",
    "view_content",
  ],
};
