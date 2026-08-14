import { useQuery } from "@tanstack/react-query";
import { OverviewAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

const defaultData = {
  overview: {
    totalMembers: 0,
    totalChildren: 0,
    totalDepartments: 0,
    totalFunds: 0,
  },
  departments: [],
  treasury: {
    totalGiving: 0,
    totalTithe: 0,
    localFunds: 0,
    trustFunds: 0,
  },
  members: {
    summary: {
      totalMembers: 0,
      totalChildren: 0,
      totalMale: 0,
      totalFemale: 0,
    },
    list: [],
  },
};

export default function usePastorDashboard() {
  const { showToast } = useToast();

  /* ======================
     QUERY: PASTOR DASHBOARD
  ====================== */
  const query = useQuery({
    queryKey: ["pastor-dashboard"],
    queryFn: async () => {
      const data = await OverviewAPI.fetchPastorOverview();
      return { ...defaultData, ...(data ?? {}) };
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    onError: (err) => {
      showToast(err.message || "Failed to fetch pastor dashboard", "error");
    },
  });

  return {
    // Data
    data: query.data ?? defaultData,

    // Query state
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,

    // Query actions
    refresh: query.refetch,
  };
}
