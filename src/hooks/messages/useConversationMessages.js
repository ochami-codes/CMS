import { useQuery } from "@tanstack/react-query";
import { MessagesAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function useConversationMessages(
  threadId,
  {
    enabled = true,
  } = {}
) {
  const { user } = useAuth();
  const currentProfileId = user?.id;

  return useQuery({
    queryKey: ["messages", "conversation", threadId],

    queryFn: async ({ signal }) => {
      const response =
        await MessagesAPI.getConversation(
          threadId,
          { signal }
        );

      const messages = Array.isArray(response?.messages)
        ? response.messages
        : [];

      return messages
        .map((message) => ({
          ...message,
          is_me:
            String(message.sender_id) ===
            String(currentProfileId),
        }))
        .sort(
          (a, b) =>
            new Date(a.created_at) -
            new Date(b.created_at)
        );
    },

    enabled:
      enabled &&
      !!threadId &&
      !!currentProfileId,

    refetchInterval: threadId ? 10000 : false,

    refetchOnWindowFocus: true,

    staleTime: 5 * 1000,
  });
}