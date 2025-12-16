// src/config/roles.js
export const ROLE_PERMISSIONS = {
  admin: [
    "manage_users",
    "view_finances",
    "edit_finances",
    "manage_content",
    "manage_departments",
  ],

  pastor: [
    "manage_content",
    "view_members",
    "manage_departments",
  ],

  elder: [
    "view_members",
    "manage_departments",
  ],

  treasurer: [
    "view_finances",
    "edit_finances",
  ],

  children_leader: [
    "manage_children",
    "view_members",
  ],

  youth_leader: [
    "manage_youth",
    "view_members",
  ],

  communication_leader: [
    "manage_announcements",
    "manage_media",
  ],

  member: [
    "view_content",
  ],
};