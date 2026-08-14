import { useQuery } from "@tanstack/react-query";
import useDebounce from "../useDebounce";
import { ChurchAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export default function useSearchChurches({
  search = "",
  conferenceId = "",
  limit = 20,
  enabled = true,
}) {
  const { showToast } = useToast();

  /* ======================
     DEBOUNCED SEARCH TERM
  ====================== */
  const debouncedSearch = useDebounce(search, 300);
  const trimmedSearch = debouncedSearch.trim();

  /* ======================
     QUERY: SEARCH CHURCHES
  ====================== */
  const query = useQuery({
    queryKey: ["churches-search", conferenceId, trimmedSearch, limit],
    queryFn: async () => {
      const res = await ChurchAPI.getChurches({
        conference_id: conferenceId,
        search: trimmedSearch,
        limit,
      });
      return res?.churches ?? [];
    },
    enabled: enabled && trimmedSearch.length >= 2,
    onError: (err) => {
      showToast(err.message || "Failed to search churches", {type: "error"});
    },
  });

  return {
    ...query,
    results: query.data ?? [],
    loading: query.isFetching,
  };
}
