// src/config/roles.js

export const ROLE_PERMISSIONS = {
  Admin: [
    "manage_users",
    "view_finances",
    "edit_finances",
    "manage_content",
    "manage_departments",
  ],

  Pastor: [
    "manage_content",
    "view_members",
    "manage_departments",
  ],

  Treasurer: [
    "view_finances",
    "edit_finances",
  ],

  Children_leader: [
    "manage_children",
    "view_members",
  ],

  Youth_leader: [
    "manage_youth",
    "view_members",
  ],

  Communication_leader: [
    "manage_announcements",
    "manage_media",
  ],

  Member: [
    "view_content",
  ],
};
