import { useMutation } from "@tanstack/react-query";
import { ChurchAPI } from "../../utils/api";

export default function useCreateChurch() {
  const mutation = useMutation({
    mutationFn: async ({
      churchName,
      conferenceId,
    }) => {
      return ChurchAPI.createChurch({
        church_name: churchName,
        conference_id: conferenceId,
      });
    },
  });

  return {
    ...mutation,
    loadingCreate: mutation.isPending,
  };
}