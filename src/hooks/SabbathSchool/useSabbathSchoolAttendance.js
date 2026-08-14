import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { SabbathSchoolAPI } from "../../utils/api";

const defaultData = {
  attendance: [],
  lastAttendance: null,
};

export default function useSabbathSchoolAttendance({
  departmentId,
  enabled = true,
} = {}) {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  /* =========================
     FETCH ATTENDANCE
  ========================== */

  const query = useQuery({
    queryKey: [
      "sabbath-school-attendance",
      departmentId,
    ],

    enabled:
      enabled && !!departmentId,

    queryFn: () =>
      SabbathSchoolAPI.getAttendance(
        departmentId
      ),

    staleTime:
      5 * 60 * 1000,

    select: (data = []) => ({
      attendance: data,
      lastAttendance:
        data[0] ?? null,
    }),
  });

  /* =========================
     SAVE ATTENDANCE
  ========================== */

  const saveMutation = useMutation({
    mutationFn: (data) =>
      SabbathSchoolAPI.saveAttendance(
        departmentId,
        data
      ),

    onSuccess: () => {
      showToast(
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
      console.error(
        "Save attendance:",
        error
      );

      showToast(
        error?.message ??
          "Failed to save attendance.", {type:"error"}
      );
    },
  });

  /* =========================
     DELETE ATTENDANCE
  ========================== */

  const deleteMutation = useMutation({
    mutationFn:
      SabbathSchoolAPI.deleteAttendance,

    onSuccess: () => {
      showToast(
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
      showToast(
        "Delete attendance:",
        {type:"error"}
      );

      showToast(
        error?.message ??
          "Failed to delete attendance.", {type:"error"}
      );
    },
  });

  return {
    /* =========================
       DATA
    ========================== */

    attendance:
      query.data?.attendance ??
      defaultData.attendance,

    lastAttendance:
      query.data?.lastAttendance ??
      defaultData.lastAttendance,

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

    /* =========================
       SAVE MUTATION
    ========================== */

    saveAttendance:
      saveMutation.mutateAsync,

    saving:
      saveMutation.isPending,

    saveIsError:
      saveMutation.isError,

    saveError:
      saveMutation.error,

    /* =========================
       DELETE MUTATION
    ========================== */

    deleteAttendance:
      deleteMutation.mutateAsync,

    deleting:
      deleteMutation.isPending,

    deleteIsError:
      deleteMutation.isError,

    deleteError:
      deleteMutation.error,
  };
}