import { useCallback } from "react";

export function useAuthMembership(user) {
  const activeChurchId =
    user?.active_church_id || null;

  const activeChurchName =
    user?.active_church_name || null;

  const activeMembership =
    user?.active_membership || null;

  const activeMembershipStatus =
    user?.active_membership_status || "guest";

  const activeMembershipRequest =
    user?.active_membership_request || null;

  const isSuspendedMember =
    activeMembershipStatus === "suspended";

  const isActiveMember =
    activeMembershipStatus === "active";
  const isTransferred =
    activeMembershipStatus ==="transferred";

  const isPendingMember =
    !!activeMembershipRequest;

  const isRejectedMember =
    activeMembershipRequest?.status === "rejected";

  const isGuest =
    !isActiveMember &&
    !isPendingMember &&
    !isSuspendedMember;

  const dashboardMode =
    isSuspendedMember
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
  }, [
    isSuspendedMember,
    isActiveMember,
    isPendingMember,
  ]);

  return {
    activeChurchId,
    activeChurchName,

    activeMembership,
    activeMembershipStatus,
    activeMembershipRequest,

    memberships:
      user?.memberships || [],

    membershipRequests:
      user?.membership_requests || [],

    isActiveMember,
    isTransferred,
    isPendingMember,
    isRejectedMember,
    isSuspendedMember,
    isGuest,

    dashboardMode,
    getAccessState,
  };
}
