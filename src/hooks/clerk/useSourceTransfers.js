import { useEffect, useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useSourceTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await ClerkAPI.getSourceTransfers();
      setTransfers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  return {
    transfers,
    loading,
    error,
    refetch: fetchTransfers,
  };
}