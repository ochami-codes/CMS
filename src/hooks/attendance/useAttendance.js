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
    registerQuery.data?.register ?? [],

  lastSabbath:
    registerQuery.data?.lastSabbath ?? [],

  // Query state
  loading:
    registerQuery.isPending,

  isError:
    registerQuery.isError,

  error:
    registerQuery.error,

  // Query actions
  refresh:
    registerQuery.refetch,

  // Mutation state
  saving:
    mutation.isPending,

  // Mutation action
  saveAttendance:
    mutation.mutateAsync,

  // Optional: expose mutation error too
  saveError:
    mutation.error,

  saveIsError:
    mutation.isError,
};
}