import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { SabbathSchoolAPI } from "../../utils/api";

const defaultData = {
  offerings: [],
};

export default function useSabbathSchoolFinances({
  departmentId,
  enabled = true,
} = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      "sabbath-school-finances",
      departmentId,
    ],

    enabled:
      enabled && !!departmentId,

    queryFn: () =>
      SabbathSchoolAPI.getOfferings(
        departmentId
      ),

    select: (data = []) => ({
      offerings: data,
    }),

    staleTime: 5 * 60 * 1000,

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load offerings."
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      SabbathSchoolAPI.saveOfferings(
        departmentId,
        data
      ),

    onSuccess: () => {
      toast.success(
        "Offering recorded successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "sabbath-school-finances",
          departmentId,
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to record offering."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn:
      SabbathSchoolAPI.deleteOfferings,

    onSuccess: () => {
      toast.success(
        "Offering deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "sabbath-school-finances",
          departmentId,
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to delete offering."
      );
    },
  });

  return {
    ...defaultData,
    ...(query.data ?? {}),

    loading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refresh: query.refetch,

    saveOfferings:
      saveMutation.mutateAsync,
    saving:
      saveMutation.isPending,

    deleteOfferings:
      deleteMutation.mutateAsync,
    deleting:
      deleteMutation.isPending,
  };
}