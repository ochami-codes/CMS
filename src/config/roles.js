// src/config/roles.js

export const ROLE_PERMISSIONS = {
  Admin: [
    "access_admin_dashboard",
    "manage_users",
    "view_members",
    "edit_members",
    "view_finances",
    "edit_finances",
    "manage_departments",
    "manage_announcements",
    "manage_media",
  ],

  Pastor: [
    "access_pastor_dashboard",
    "manage_announcements",
  ],

  Treasurer: [
    "access_treasury_dashboard",
    "view_finances",
    "edit_finances",
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
    "manage_announcements",
    "manage_media",
  ],

  Member: [
    "access_dashboard",
    "view_content",
  ],
};
