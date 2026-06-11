import { useEffect, useState } from "react";
import { RolesAPI } from "../../utils/api";

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await RolesAPI.getAll();
        setRoles(res.roles ?? []);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { roles, loading };
}