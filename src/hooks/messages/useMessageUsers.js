import { useQuery } from "@tanstack/react-query";
import { MessagesAPI } from "../../utils/api";

export default function useMessageUsers({
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: ["messages", "users"],

    queryFn: async () => {
      const response =
        await MessagesAPI.getUsers();

      if (!Array.isArray(response?.groups)) {
        return [];
      }

      return response.groups.map((group) => ({
        ...group,

        users: (group.users || []).map(
          (user) => ({
            ...user,
            full_name:
              user.full_name ??
              user.name ??
              "Unknown",
          })
        ),
      }));
    },

    enabled,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });
}