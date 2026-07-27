import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminAPI } from "../../utils/api";

export function useAdminMembers(activeChurchId, search) {
  const query = useQuery({
    queryKey: ["admin", "members", activeChurchId],

    queryFn: async () => {
      const res = await AdminAPI.fetchMembers();
      return res.members ?? [];
    },

    enabled: Boolean(activeChurchId),
  });

  const members = useMemo(() => {
    const allMembers = query.data ?? [];
    const searchTerm = search?.trim().toLowerCase();

    if (!searchTerm) {
      return allMembers;
    }

    return allMembers.filter((member) => {
      const searchableFields = [
        member.full_name,
        member.status,
        ...(member.departments ?? []),
        ...(member.roles ?? []),
      ];

      return searchableFields.some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      );
    });
  }, [query.data, search]);

  return {
    members,

    initialLoading: query.isPending,

    refreshing: query.isFetching && !query.isPending,

    reload: query.refetch,

    error: query.error,
    isError: query.isError,
  };
}