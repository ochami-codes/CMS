import {
  useEffect,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AuthAPI } from "../utils/api";
import { normalizeRole } from "../config/roles";
import { supabase } from "../supabaseClient";

/* -----------------------------------------
   Normalize User
----------------------------------------- */

function normalizeUser(data) {
  if (!data?.user) {
    return null;
  }

  const user = data.user;
  const activeChurch =
    user.active_church ?? null;

  return {
    id: user.id,
    profileId: user.id,
    authUserId: user.auth_user_id,

    email: user.email,
    fullName: user.full_name,

    churches:
      user.churches ?? [],

    membershipRequests:
      user.membership_requests ?? [],

    activeChurch: activeChurch
      ? {
          id: activeChurch.id,
          name: activeChurch.name,
          membershipId:
            activeChurch.membershipId,
          status: activeChurch.status,

          roles: (
            activeChurch.roles ?? []
          ).map(normalizeRole),

          permissions:
            activeChurch.permissions ?? [],

          departments:
            activeChurch.departments ?? [],
        }
      : null,

    activeChurchId:
      user.active_church_id,

    activeChurchName:
      user.active_church_name,

    activeMemberId:
      user.active_member_id,

    activeMembershipStatus:
      user.active_membership_status,

    isMember:
      user.is_member ?? false,

    isPending:
      user.is_pending ?? false,

    isSuspended:
      user.is_suspended ?? false,
  };
}

/* -----------------------------------------
   Auth Core Hook
----------------------------------------- */

export function useAuthCore() {
  const queryClient =
    useQueryClient();

  /* ---------------------------------------
     Supabase Session State
  --------------------------------------- */

  const [sessionReady, setSessionReady] =
    useState(false);

  const [hasSession, setHasSession] =
    useState(false);

  /* ---------------------------------------
     Initialize Session
  --------------------------------------- */

  useEffect(() => {
    let mounted = true;

    const initializeSession =
      async () => {
        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        if (error) {
          setHasSession(false);
        } else {
          setHasSession(
            !!data.session
          );
        }

        setSessionReady(true);
      };

    initializeSession();

    /* -------------------------------------
       Listen For Auth Changes
    ------------------------------------- */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!mounted) {
            return;
          }

          setHasSession(
            !!session
          );
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ---------------------------------------
     Current User
  --------------------------------------- */

  const {
    data: user = null,
    isLoading,
    isFetched,
    error: authError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const data =
        await AuthAPI.me();

      return normalizeUser(data);
    },

    /*
     * /me only executes after we know
     * whether a Supabase session exists.
     */
    enabled:
      sessionReady &&
      hasSession,

    retry: false,
  });

  /* ---------------------------------------
     Login
  --------------------------------------- */

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

      onSuccess: async () => {
        /*
         * Supabase auth state should now
         * contain the authenticated session.
         *
         * Refetch /me after login.
         */
        await queryClient.refetchQueries({
          queryKey: ["me"],
          type: "all",
        });
      },
    });

  /* ---------------------------------------
     Logout
  --------------------------------------- */

  const logoutMutation =
    useMutation({
      mutationFn: () =>
        AuthAPI.logout(),

      onSuccess: () => {
        /*
         * Immediately clear authenticated
         * user state.
         */
        queryClient.setQueryData(
          ["me"],
          null
        );

        /*
         * Remove authenticated cached data.
         */
        queryClient.removeQueries({
          predicate: (query) =>
            query.queryKey[0] !== "me",
        });

        /*
         * Explicitly mark that there is
         * no authenticated user.
         */
        setHasSession(false);
      },
    });

  /* ---------------------------------------
     Manual User Setter
  --------------------------------------- */

  const setUser = (user) => {
    queryClient.setQueryData(
      ["me"],
      user
    );
  };

  /* ---------------------------------------
     Auth Ready
  --------------------------------------- */

  const authReady =
    sessionReady &&
    (
      !hasSession ||
      isFetched
    );

  /* ---------------------------------------
     Return
  --------------------------------------- */

  return {
    user,

    authReady,

    authLoading:
      !sessionReady ||
      isLoading ||
      loginMutation.isPending ||
      logoutMutation.isPending,

    authError:
      authError?.message ?? null,

    login:
      loginMutation.mutateAsync,

    logout:
      logoutMutation.mutateAsync,

    refetchUser,

    setUser,
  };
}
