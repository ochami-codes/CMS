import { useEffect, useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useTransfers(params = "") {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const data = await ClerkAPI.getTransfers(params);
      setTransfers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [params]);

  return {
    transfers,
    loading,
    error,
    refetch: fetchTransfers,
  };
}