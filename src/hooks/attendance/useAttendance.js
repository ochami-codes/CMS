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
  const queryClient = useQueryClient();

  /*
   * Fetch attendance register
   */
  const registerQuery = useQuery({
    queryKey: [
      "attendance",
      departmentId,
      attendanceDate,
    ],

    enabled:
      enabled &&
      !!departmentId &&
      !!attendanceDate,

    queryFn: () =>
      AttendanceAPI.fetch({
        departmentId,
        attendanceDate,
      }),

    staleTime: 5 * 60 * 1000,

    select: (data) => ({
      register: data?.register ?? [],
      lastSabbath: data?.lastSabbath ?? [],
    }),
  });

  /*
   * Save attendance
   */
  const mutation = useMutation({
    mutationFn: (payload) =>
      AttendanceAPI.save({
        departmentId,
        attendanceDate,
        records: payload.records,
      }),

    onSuccess: () => {
      toast.success("Attendance saved");

      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
    },

    onError: (error) => {
      console.error("Save attendance error:", error);

      toast.error(
        error?.message ??
          "Failed to save attendance"
      );
    },
  });

  return {
    /*
     * Attendance data
     */
    register:
      registerQuery.data?.register ?? [],

    lastSabbath:
      registerQuery.data?.lastSabbath ?? [],

    /*
     * Query state
     */
    loading:
      registerQuery.isPending,

    isError:
      registerQuery.isError,

    error:
      registerQuery.error,

    /*
     * Query actions
     */
    refresh:
      registerQuery.refetch,

    /*
     * Mutation state
     */
    saving:
      mutation.isPending,

    /*
     * Mutation action
     *
     * Expected:
     * {
     *   records: [
     *     {
     *       memberId: null,
     *       childId: 123,
     *       status: "present",
     *       remarks: "..."
     *     }
     *   ]
     * }
     */
    saveAttendance:
      mutation.mutateAsync,

    /*
     * Mutation error state
     */
    saveError:
      mutation.error,

    saveIsError:
      mutation.isError,
  };
}