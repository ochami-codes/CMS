import { useQuery } from "@tanstack/react-query";
import { useToast} from "../../components/ToastProvider";

import { AnnouncementsAPI } from "../../utils/api";

export default function useDepartmentAnnouncements({
  departmentId,
  limit = 20,
  enabled = true,
} = {}) {
  const { showToast } = useToast();  
  const query = useQuery({
    queryKey: [
      "announcements",
      "department",
      departmentId,
      limit,
    ],

    queryFn: () =>
      AnnouncementsAPI.fetchDepartmentAnnouncements(
        departmentId,
        limit
      ),

    enabled:
      enabled &&
      !!departmentId,

    staleTime: 5 * 60 * 1000,

    select: (data) => ({
      announcements:
        data?.announcements ?? [],
    }),

    onError: (error) => {
      console.error(error);

      showToast( error.message || "Failed to load announcements", {type: "error"});
    },
  });

  return {
    announcements:
      query.data?.announcements ?? [],

    loading: query.isPending,

    error: query.error,

    isError: query.isError,

    refresh: query.refetch,

    isFetching: query.isFetching,

    isRefetching: query.isRefetching,
  };
}