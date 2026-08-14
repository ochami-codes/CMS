import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RolesAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useRoles() {
  const { showToast } = useToast();

  /* ======================
     FETCH ROLES
  ====================== */
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
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (err) => {
      showToast(err.message || "Failed to fetch roles", {type:"error"});
    },
  });

  /* ======================
     ROLE LABELS
  ====================== */
  const roleLabels = useMemo(
    () =>
      Object.fromEntries(
        roles.map((role) => [role.name, role.label ?? role.name])
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
