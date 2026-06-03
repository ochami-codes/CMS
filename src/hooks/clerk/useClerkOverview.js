import { useEffect, useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useClerkOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const res = await ClerkAPI.overview();
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchOverview,
  };
}