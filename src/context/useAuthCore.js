import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AuthAPI } from "../utils/api";
import { normalizeRole } from "../config/roles";

/* -----------------------------------------
   Normalize User
----------------------------------------- */
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

/* -----------------------------------------
   Auth Core Hook
----------------------------------------- */
export function useAuthCore() {
  const queryClient = useQueryClient();

  // Current User
  const {
    data: user = null,
    isLoading,
    isFetched,
    error: authError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const data = await AuthAPI.me();
      return normalizeUser(data);
    },
    retry: false,
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) =>
      AuthAPI.login({ email, password }),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["me"],
        type: "all",
      });
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSuccess: () => {
      // Clear current user
      queryClient.setQueryData(["me"], null);

      // Remove other authenticated cached data
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "me",
      });
    },
  });

  // Manual User Setter
  const setUser = (user) => {
    queryClient.setQueryData(["me"], user);
  };

  return {
    user,
    authReady: isFetched,
    authLoading:
      isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,
    authError: authError?.message ?? null,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refetchUser,
    setUser,
  };
}
