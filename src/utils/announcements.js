// utils/announcements.js

export function filterAnnouncements(
  announcements,
  user
) {
  if (!Array.isArray(announcements)) {
    return [];
  }

  return announcements.filter((announcement) => {
    // visible to everyone
    if (announcement.target === "all") {
      return true;
    }

    // role-based target
    if (
      announcement.target === user?.primary_role
    ) {
      return true;
    }

    // department-based target
    if (
      announcement.target ===
      user?.department_name
    ) {
      return true;
    }

    return false;
  });
}
