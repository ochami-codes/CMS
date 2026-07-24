import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "../supabaseClient";

export function useAuthRealtime(
  profileId,
  authReady
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authReady || !profileId) return;

    const channel = supabase
      .channel(`profile-sync-${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${profileId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["me"],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    authReady,
    profileId,
    queryClient,
  ]);
}
