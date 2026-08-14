import { useQuery } from "@tanstack/react-query";
import { DepartmentsAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useDepartments(filters = {}) {
  const { showToast } = useToast();

  /* ======================
     QUERY: DEPARTMENTS
  ====================== */
  const query = useQuery({
    queryKey: ["departments", filters],
    queryFn: async () => {
      const response = await DepartmentsAPI.fetch(filters);
      return response?.departments ?? [];
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    onError: (err) => {
      showToast(err.message || "Failed to fetch departments", {type:"error"});
    },
  });

  return {
    /* ======================
       DATA
    ====================== */
    departments: query.data ?? [],

    /* ======================
       QUERY STATE
    ====================== */
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    /* ======================
       QUERY ACTIONS
    ====================== */
    refetch: query.refetch,
  };
}
