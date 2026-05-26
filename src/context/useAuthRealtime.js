import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useAuthRealtime(profileId, fetchMe, authReady) {
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
        async () => {
          await fetchMe();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authReady, profileId, fetchMe]);
}
