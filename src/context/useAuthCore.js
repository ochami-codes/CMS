import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AuthAPI } from "../utils/api";
import { normalizeRole } from "../config/roles";

/* -------------------------
   Normalize User
------------------------- */

function normalizeUser(data) {
  if (!data?.user) return null;

  const user = data.user;
  const activeChurch = user.active_church ?? null;

  return {
    // -------------------------
    // Identity
    // -------------------------

    id: user.id,

    profileId: user.id,

    authUserId:
      user.auth_user_id,

    email: user.email,

    fullName:
      user.full_name,

    // -------------------------
    // Churches
    // -------------------------

    churches:
      user.churches || [],

    // -------------------------
    // Membership Requests
    // -------------------------

    membershipRequests:
      user.membership_requests || [],

    // -------------------------
    // Active Church
    // -------------------------

    activeChurch: activeChurch
      ? {
          id: activeChurch.id,

          name: activeChurch.name,

          membershipId:
            activeChurch.membershipId,

          status:
            activeChurch.status,

          roles:
            (activeChurch.roles || [])
              .map(normalizeRole),

          permissions:
            activeChurch.permissions || [],

          departments:
            activeChurch.departments || [],
        }
      : null,

    // -------------------------
    // Active Church Context
    // -------------------------

    activeChurchId:
      user.active_church_id,

    activeChurchName:
      user.active_church_name,

    activeMemberId:
      user.active_member_id,

    activeMembershipStatus:
      user.active_membership_status,

    // -------------------------
    // Membership State
    // -------------------------

    isMember:
      user.is_member ?? false,

    isPending:
      user.is_pending ?? false,

    isSuspended:
      user.is_suspended ?? false,
  };
}

/* -------------------------
   Auth Core
------------------------- */

export function useAuthCore() {
  const queryClient =
    useQueryClient();

  /* -------------------------
     Current User
  ------------------------- */

  const {
    data: user = null,

    isLoading,

    isFetched,

    error: authError,

    refetch: refetchUser,
  } = useQuery({
    queryKey: ["me"],

    enabled:
      !!localStorage.getItem(
        "access_token"
      ),

    retry: false,

    queryFn: async () => {
      try {
        const data =
          await AuthAPI.me();

        return normalizeUser(data);
      } catch (err) {
        localStorage.removeItem(
          "access_token"
        );

        throw err;
      }
    },
  });

  /* -------------------------
     Login
  ------------------------- */

  const loginMutation =
    useMutation({
      mutationFn: ({
        email,
        password,
      }) =>
        AuthAPI.login({
          email,
          password,
        }),

      onSuccess: async (data) => {
        if (!data?.access_token) {
          throw new Error(
            "Login failed"
          );
        }

        localStorage.setItem(
          "access_token",
          data.access_token
        );

        await queryClient.invalidateQueries(
          {
            queryKey: ["me"],
          }
        );
      },
    });

  /* -------------------------
     Client-Side Logout
  ------------------------- */

  const logout = () => {
    localStorage.removeItem(
      "access_token"
    );

    queryClient.setQueryData(
      ["me"],
      null
    );

    queryClient.removeQueries({
      queryKey: ["me"],
    });
  };

  return {
    /* -------------------------
       User
    ------------------------- */

    user,

    /* -------------------------
       Auth State
    ------------------------- */

    authReady:
      isFetched,

    authLoading:
      isLoading,

    authError:
      authError?.message ?? null,

    /* -------------------------
       Auth Actions
    ------------------------- */

    login:
      loginMutation.mutateAsync,

    logout,

    /* -------------------------
       User Utilities
    ------------------------- */

    refetchUser,

    setUser: (user) =>
      queryClient.setQueryData(
        ["me"],
        user
      ),
  };
}
