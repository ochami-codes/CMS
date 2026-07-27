import { useQuery } from "@tanstack/react-query";

import { DepartmentsAPI } from "../utils/api";

export default function useDepartments(
  filters = {}
) {
  const query = useQuery({
    queryKey: [
      "departments",
      filters,
    ],

    queryFn: async () => {
      const response =
        await DepartmentsAPI.fetch(
          filters
        );

      return (
        response?.departments ?? []
      );
    },

    staleTime:
      5 * 60 * 1000,
  });

  return {
    /* =========================
       DATA
    ========================== */

    departments:
      query.data ?? [],

    /* =========================
       QUERY STATE
    ========================== */

    loading:
      query.isLoading,

    isFetching:
      query.isFetching,

    isError:
      query.isError,

    error:
      query.error,

    /* =========================
       QUERY ACTION
    ========================== */

    refresh:
      query.refetch,
  };
}