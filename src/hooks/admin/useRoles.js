import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RolesAPI } from "../../utils/api";

export function useRoles() {
  const {
    data: roles = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["roles"],

    queryFn: async () => {
      const res = await RolesAPI.getAll();

      return res?.roles ?? [];
    },

    staleTime: 10 * 60 * 1000,
  });

  const roleLabels = useMemo(
    () =>
      Object.fromEntries(
        roles.map((role) => [
          role.name,
          role.label ?? role.name,
        ])
      ),
    [roles]
  );

  return {
    /* Role data */
    roles,
    roleLabels,

    /* Query state */
    isLoading,
    isFetching,
    isError,
    error,

    /* Query actions */
    refetch,
  };
}