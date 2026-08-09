import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "../utils/api";
import { normalizeRole } from "../config/roles";

/* Normalize User */
function normalizeUser(data) {
  if (!data?.user) return null;

  const user = data.user;
  const activeChurch = user.active_church ?? null;

  return {
    id: user.id,
    profileId: user.id,
    authUserId: user.auth_user_id,
    email: user.email,
    fullName: user.full_name,

    churches: user.churches ?? [],
    membershipRequests: user.membership_requests ?? [],

    activeChurch: activeChurch
      ? {
          id: activeChurch.id,
          name: activeChurch.name,
          membershipId: activeChurch.membershipId,
          status: activeChurch.status,
          roles: (activeChurch.roles ?? []).map(normalizeRole),
          permissions: activeChurch.permissions ?? [],
          departments: activeChurch.departments ?? [],
        }
      : null,

    activeChurchId: user.active_church_id,
    activeChurchName: user.active_church_name,
    activeMemberId: user.active_member_id,
    activeMembershipStatus: user.active_membership_status,

    isMember: user.is_member ?? false,
    isPending: user.is_pending ?? false,
    isSuspended: user.is_suspended ?? false,
  };
}

/* Auth Core Hook */
export function useAuthCore() {
  const queryClient = useQueryClient();
  const hasAccessToken = !!localStorage.getItem("access_token");

  // Current User
  const {
    data: user = null,
    isLoading,
    isFetched,
    error: authError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["me"],
    enabled: hasAccessToken,
    retry: false,
    queryFn: async () => {
      try {
        const data = await AuthAPI.me();
        return normalizeUser(data);
      } catch (err) {
        localStorage.removeItem("access_token");
        throw err;
      }
    },
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => AuthAPI.login({ email, password }),
    onSuccess: async (data) => {
      if (!data?.access_token) throw new Error("Login failed");

      localStorage.setItem("access_token", data.access_token);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.setQueryData(["me"], null);
  };

  // Set User manually
  const setUser = (user) => {
    queryClient.setQueryData(["me"], user);
  };

  return {
    user,
    authReady: hasAccessToken ? isFetched : true,
    authLoading: hasAccessToken ? isLoading : false,
    authError: authError?.message ?? null,

    login: loginMutation.mutateAsync,
    logout,
    refetchUser,
    setUser,
  };
}

