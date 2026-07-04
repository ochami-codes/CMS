import { useQuery } from "@tanstack/react-query";

import { DepartmentsAPI } from "../utils/api";

export default function useDepartments(
  filters = {}
) {

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({

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
        response.departments || []
      );

    },

    initialData: [],

    staleTime:
      5 * 60 * 1000,

  });


  return {

    departments: data,

    loading:
      isLoading || isFetching,

    error,

    refresh:
      refetch,

  };

}