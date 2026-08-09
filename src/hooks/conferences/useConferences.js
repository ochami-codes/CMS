import { useQuery } from "@tanstack/react-query";
import { AuthAPI } from "../../utils/api";

export default function useConferences() {
  const query = useQuery({
    queryKey: ["conferences"],

    queryFn: async () => {
      const res =
        await AuthAPI.getConferences();

      return res?.conferences ?? [];
    },

    staleTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    conferences: query.data ?? [],
    loading: query.isLoading,
  };
}