import { useEffect, useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useChildren(params = "") {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const data = await ClerkAPI.getChildren(params);
      setChildren(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, [params]);

  return {
    children,
    loading,
    error,
    refetch: fetchChildren,
  };
}