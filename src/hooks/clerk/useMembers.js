import { useEffect, useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useMembers(params = "") {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await ClerkAPI.getMembers(params);
      setMembers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [params]);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
  };
}