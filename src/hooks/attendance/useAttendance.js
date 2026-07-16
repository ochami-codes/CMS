import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { AttendanceAPI } from "../../utils/api";

export default function useAttendance({
  departmentId,
  attendanceDate,
  enabled = true,
} = {}) {
  const queryClient =
    useQueryClient();

  const registerQuery = useQuery({
    queryKey: [
  "attendance",
  departmentId,
  attendanceDate,
],

    enabled:
      enabled && !!attendanceDate,

    queryFn: () =>
      AttendanceAPI.save({
        departmentId,
        attendanceDate,
      }),

    staleTime:
      5 * 60 * 1000,

    select: (data) => ({
      register:
        data?.register ?? [],

      lastSabbath:
        data?.lastSabbath ?? [],
    }),

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load attendance"
      );
    },
  });

  const mutation = useMutation({
    mutationFn:
      AttendanceAPI.save,

    onSuccess: () => {
      toast.success(
        "Attendance saved"
      );

      queryClient.invalidateQueries({
        queryKey:["attendance"]
      });
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to save attendance"
      );
    },
  });

  return {
    register:
      registerQuery.data?.register ??
      [],

    lastSabbath:
      registerQuery.data
        ?.lastSabbath ?? [],

    loading:
      registerQuery.isPending,

    saving:
      mutation.isPending,

    error:
      registerQuery.error,

    refresh:
      registerQuery.refetch,

    saveAttendance:
      mutation.mutateAsync,
  };
}