import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { OverviewAPI } from "../../utils/api";

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
  const query = useQuery({
    queryKey: ["pastor-dashboard"],

    queryFn: async () => {
      const data =
        await OverviewAPI.fetchPastorOverview();

      return {
        ...defaultData,
        ...(data ?? {}),
      };
    },

    staleTime: 5 * 60 * 1000,

    onError: (error) => {
      console.error(error);

      toast.error(
        "Failed to load pastor dashboard"
      );
    },
  });

  return {
    data: query.data ?? defaultData,

    loading: query.isPending,
    error: query.error,

    refresh: query.refetch,

    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
  };
}