import useAnnouncements from "../communication/useAnnouncements";

export default function useDashboardAnnouncements({
  limit = 5,
  enabled = true,
} = {}) {
  const church = useAnnouncements({
    type: "church",
    limit,
    enabled,
  });

  const department = useAnnouncements({
    type: "departments",
    limit,
    enabled,
  });

  return {
    churchAnnouncements:
      church.announcements,

    departmentAnnouncements:
      department.announcements,

    loading:
      church.loading ||
      department.loading,

    error:
      church.error ||
      department.error,

    isFetching:
      church.isFetching ||
      department.isFetching,

    isRefetching:
      church.isRefetching ||
      department.isRefetching,

    refresh: async () => {
      await Promise.all([
        church.refresh(),
        department.refresh(),
      ]);
    },
  };
}