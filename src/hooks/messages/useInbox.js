import { useQuery } from "@tanstack/react-query";
import { MessagesAPI } from "../../utils/api";

export default function useInbox({
  enabled = true,
} = {}) {
  return useQuery({
    queryKey: ["messages", "inbox"],

    queryFn: async () => {
      const response =
        await MessagesAPI.getInbox();

      return Array.isArray(response?.inbox)
        ? response.inbox
        : [];
    },

    enabled,

    staleTime: 5 * 1000,

    refetchOnWindowFocus: true,
  });
}