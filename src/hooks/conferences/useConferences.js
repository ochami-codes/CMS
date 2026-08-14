import { useQuery } from "@tanstack/react-query";
import { AuthAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useConferences() {
  const { showToast } = useToast();

  /* ======================
     QUERY: CONFERENCES
  ====================== */
  const query = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const res = await AuthAPI.getConferences();
      return res?.conferences ?? [];
    },
    staleTime: 10 * 60 * 1000, // cache for 10 minutes
    onError: (err) => {
      showToast(err.message || "Failed to fetch conferences", "error");
    },
  });

  return {
    ...query,
    conferences: query.data ?? [],
    loading: query.isLoading,
  };
}
