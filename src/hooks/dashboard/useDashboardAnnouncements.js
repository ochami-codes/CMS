import useChurchAnnouncements from "../communication/useChurchAnnouncement";
import useMyDepartmentAnnouncements from "../communication/useMyDepartmentAnnouncement";
export default function useDashboardAnnouncements() {
  const church = useChurchAnnouncements();

  const department = useMyDepartmentAnnouncements();

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
    isError:
       church.isError ||
       department.isError,  

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