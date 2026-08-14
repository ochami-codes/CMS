import { useMutation } from "@tanstack/react-query";
import { ChurchAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useCreateChurch() {
  const { showToast } = useToast();

  /* ======================
     CREATE CHURCH MUTATION
  ====================== */
  const mutation = useMutation({
    mutationFn: async ({ churchName, conferenceId }) =>
      ChurchAPI.createChurch({
        church_name: churchName,
        conference_id: conferenceId,
      }),
    onSuccess: () => {
      showToast("Church created successfully");
    },
    onError: (error) => {
      showToast(error.message || "Failed to create church", {type: "error"});
    },
  });

  return {
    ...mutation,
    loadingCreate: mutation.isPending,
  };
}
