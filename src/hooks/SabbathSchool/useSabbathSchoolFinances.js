import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { SabbathSchoolAPI } from "../../utils/api";

const defaultData = {
  offerings: [],
};

export default function useSabbathSchoolFinances({
  departmentId,
  enabled = true,
} = {}) {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  /* =========================
     FETCH OFFERINGS
  ========================== */

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

    staleTime:
      5 * 60 * 1000,
  });

  /* =========================
     SAVE OFFERINGS
  ========================== */

  const saveMutation = useMutation({
    mutationFn: (data) =>
      SabbathSchoolAPI.saveOfferings(
        departmentId,
        data
      ),

    onSuccess: () => {
      showToast(
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

      showToast(
        error?.message ??
          "Failed to record offering.", {type:"error"}
      );
    },
  });

  /* =========================
     DELETE OFFERINGS
  ========================== */

  const deleteMutation = useMutation({
    mutationFn:
      SabbathSchoolAPI.deleteOfferings,

    onSuccess: () => {
      showToast(
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

      showToast(
        error?.message ??
          "Failed to delete offering.", {type:"error"}
      );
    },
  });

  /* =========================
     DATA
  ========================== */

  const offerings =
    query.data?.offerings ??
    defaultData.offerings;

  return {
    offerings,

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

    saveOfferings:
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

    deleteOfferings:
      deleteMutation.mutateAsync,

    deleting:
      deleteMutation.isPending,

    deleteIsError:
      deleteMutation.isError,

    deleteError:
      deleteMutation.error,
  };
}