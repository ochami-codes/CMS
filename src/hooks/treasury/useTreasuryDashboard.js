import { useCallback, useEffect, useState } from "react";
import { TreasuryAPI } from "../../utils/api";
import toast from "react-hot-toast";

export function useTreasuryDashboard(params = {}) {
  const [data, setData] = useState({
    overview: null,
    members: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [overview, members] = await Promise.all([
        TreasuryAPI.overview(params),
        TreasuryAPI.memberGivingSummary(params),
      ]);

      setData({
        overview: overview || null,
        members: members || [],
      });

    } catch (err) {
      console.error(err);
      setError(err);
      toast.error("Failed to load treasury data");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- REFRESH ---------------- */
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}