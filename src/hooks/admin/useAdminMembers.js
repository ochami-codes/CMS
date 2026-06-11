import { useEffect, useState } from "react";
import { AdminAPI } from "../../utils/api";

export function useAdminMembers(activeChurchId, search) {
  const [members, setMembers] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMembers = async (searchValue) => {
    if (!activeChurchId) return;

    try {
      if (!members.length) setInitialLoading(true);
      else setRefreshing(true);

      const params = new URLSearchParams({ search: searchValue || "" });

      const res = await AdminAPI.fetchMembers(params.toString());
      setMembers(res.members ?? []);
    } catch {
      throw new Error("Failed to load members");
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMembers(search);
  }, [activeChurchId, search]);

  return {
    members,
    initialLoading,
    refreshing,
    reload: () => loadMembers(search),
  };
}