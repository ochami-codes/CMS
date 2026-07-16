import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { SabbathSchoolAPI } from "../../utils/api";

const defaultData = {
  attendance: [],
  lastAttendance: null,
};

export default function useSabbathSchoolAttendance({
  departmentId,
  enabled = true,
} = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [
      "sabbath-school-attendance",
      departmentId,
    ],

    enabled: enabled && !!departmentId,

    queryFn: () =>
      SabbathSchoolAPI.getAttendance(
        departmentId
      ),

    staleTime: 5 * 60 * 1000,

    select: (data = []) => ({
      attendance: data,
      lastAttendance: data[0] ?? null,
    }),

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load attendance."
      );
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      SabbathSchoolAPI.saveAttendance(
        departmentId,
        data
      ),

    onSuccess: () => {
      toast.success(
        "Attendance saved successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "sabbath-school-attendance",
          departmentId,
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to save attendance."
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn:
      SabbathSchoolAPI.deleteAttendance,

    onSuccess: () => {
      toast.success(
        "Attendance deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "sabbath-school-attendance",
          departmentId,
        ],
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to delete attendance."
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

    saveAttendance:
      saveMutation.mutateAsync,
    saving: saveMutation.isPending,

    deleteAttendance:
      deleteMutation.mutateAsync,
    deleting: deleteMutation.isPending,
  };
}