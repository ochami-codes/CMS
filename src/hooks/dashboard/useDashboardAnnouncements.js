import useAnnouncements from "../communication/useAnnouncements";

export default function useDashboardAnnouncements({
  departmentId,
  limit = 5,
  enabled = true,
} = {}) {
  return useAnnouncements({
    departmentId,
    limit,
    enabled,
  });
}