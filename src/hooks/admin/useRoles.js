import { useQuery } from "@tanstack/react-query";
import { RolesAPI } from "../../utils/api";

export function useRoles() {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: RolesAPI.getAll,
  });

  return {
    roles: query.data?.roles ?? [],
    loading: query.isLoading,

    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}