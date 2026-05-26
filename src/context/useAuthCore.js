import { useState, useEffect, useCallback } from "react";
import { AuthAPI, RolesAPI } from "../utils/api";
import { normalizeRole } from "../config/roles.js";

export function useAuthCore() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);

  const fetchMe = useCallback(async () => {
    try {
      const data = await AuthAPI.me();

      if (!data?.user) {
        setUser(null);
        return null;
      }

      const normalizedUser = {
        ...data.user,
        profileId: data.user.id,
        authUserId: data.user.auth_user_id,
        roles: (data.user.roles || []).map(normalizeRole),
        permissions: data.user.permissions || [],
        memberships: data.user.memberships || [],
        membership_requests: data.user.membership_requests || [],
        active_membership: data.user.active_membership || null,
        active_membership_request: data.user.active_membership_request || null,
        active_membership_status:
          data.user.active_membership_status || "guest",
        active_church_name: data.user.active_church_name || null,
        active_church_id: data.user.active_church_id || null,
      };

      setUser(normalizedUser);
      return normalizedUser;
    } catch (err) {
      console.error("fetchMe failed:", err);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  }, []);

  const login = async ({ email, password }) => {
    setAuthError(null);
    setAuthReady(false);

    try {
      const data = await AuthAPI.login({ email, password });

      if (!data?.access_token) {
        throw new Error("Login failed");
      }

      localStorage.setItem("access_token", data.access_token);

      const realUser = await fetchMe();

      if (!realUser) {
        throw new Error("Failed to load user");
      }
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    } finally {
      setAuthReady(true);
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch {}

    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    fetchMe().finally(() => setAuthReady(true));
  }, [fetchMe]);

  return {
    user,
    setUser,
    authReady,
    authError,
    setAuthError,
    fetchMe,
    refetchUser: fetchMe,
    login,
    logout,
  };
}
