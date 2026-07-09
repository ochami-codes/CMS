import useDailyVerse from "./useDailyVerse";
import useDashboardAnnouncements from "./useDashboardAnnouncements";
import useBirthdays from "./useBirthdays";
import useGuestMembership from "./useGuestMembership";

export default function useDashboardData({
  churchId,
  departmentId,
  isGuest,
} = {}) {
  const verseQuery =
    useDailyVerse();

  const announcementsQuery =
    useDashboardAnnouncements({
      departmentId,
      limit: 10,
    });

  const birthdaysQuery =
    useBirthdays({
      churchId,
      enabled: !isGuest,
    });

  const membershipQuery =
    useGuestMembership({
      enabled: isGuest,
    });

  return {
    loading:
      verseQuery.loading ||
      announcementsQuery.loading ||
      birthdaysQuery.loading ||
      membershipQuery.loading,

    initialized: true,

    verse: verseQuery.verse,

    announcements:
      announcementsQuery.announcements,

    birthday:
      birthdaysQuery.birthday,

    todayBirthdays:
      birthdaysQuery.todayBirthdays,

    upcomingBirthdays:
      birthdaysQuery.upcomingBirthdays,

    membership:
      membershipQuery.membership,

    refresh: async () => {
      await Promise.all([
        verseQuery.refresh(),
        announcementsQuery.refresh(),
        birthdaysQuery.refresh(),
        membershipQuery.refresh(),
      ]);
    },

    isFetching:
      verseQuery.isFetching ||
      announcementsQuery.isFetching ||
      birthdaysQuery.isFetching ||
      membershipQuery.isFetching,
  };
}