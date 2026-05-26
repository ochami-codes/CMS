import { useMemo, useCallback } from "react";

export function useAuthMembership(user) {
  const activeChurchId = user?.active_church_id || null;
  const activeChurchName = user?.active_church_name || null;

  const activeMembership = useMemo(() => {
    return (
      user?.memberships?.find(
        (m) => m.church_id === activeChurchId
      ) || null
    );
  }, [user, activeChurchId]);

  const activeMembershipStatus =
    activeMembership?.status || "guest";

  const isSuspendedMember =
    activeMembershipStatus === "suspended";

  const isActiveMember =
    activeMembershipStatus === "active" && !isSuspendedMember;

  const activeMembershipRequest =
    user?.active_membership_request || null;

  const activeMembershipRequestStatus =
    activeMembershipRequest?.status || null;

  const isPendingMember =
    activeMembershipRequestStatus === "requested";

  const isRejectedMember =
    activeMembershipRequestStatus === "rejected";

  const isGuest =
    !isActiveMember && !isPendingMember;

  const hasAnyMembership =
    (user?.memberships || []).length > 0;

  const activeMemberships =
    (user?.memberships || []).filter(
      (m) => m.status === "active"
    );

  const churchRequested =
    activeMembershipRequest?.churches?.name || null;

  const isAccessBlocked = isSuspendedMember;

  const dashboardMode = isSuspendedMember
    ? "suspended"
    : isActiveMember
    ? "member"
    : isPendingMember
    ? "requested"
    : "guest";

  const getAccessState = useCallback(() => {
    if (isSuspendedMember) return "suspended";
    if (isActiveMember) return "active";
    if (isPendingMember) return "pending";
    return "guest";
  }, [isSuspendedMember, isActiveMember, isPendingMember]);

  return {
    activeChurchId,
    activeChurchName,

    activeMembership,
    activeMembershipStatus,

    activeMembershipRequest,
    activeMembershipRequestStatus,

    churchRequested,

    isActiveMember,
    isPendingMember,
    isRejectedMember,
    isSuspendedMember,

    isGuest,
    isAccessBlocked,

    hasAnyMembership,
    activeMemberships,

    dashboardMode,
    getAccessState,
  };
}
