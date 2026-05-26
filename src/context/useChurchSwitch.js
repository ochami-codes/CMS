import { useCallback } from "react";
import { ChurchAPI } from "../utils/api";

export function useChurchSwitch(fetchMe) {
  const switchChurch = useCallback(
    async (churchId) => {
      try {
        await ChurchAPI.setActiveChurch({
          church_id: churchId,
        });

        await fetchMe();

        return true;
      } catch (err) {
        console.error("Switch church failed:", err);
        return false;
      }
    },
    [fetchMe]
  );

  return { switchChurch };
}
