import { useCallback } from "react";

export function useAuthMembership(user) {
  // -----------------------------------------
  // Active church
  // -----------------------------------------

  const activeChurch =
    user?.activeChurch ?? null;

  const activeChurchId =
    user?.activeChurchId ??
    activeChurch?.id ??
    null;

  const activeChurchName =
    user?.activeChurchName ??
    activeChurch?.name ??
    null;

  // -----------------------------------------
  // All churches
  // -----------------------------------------

  const churches =
    user?.churches ?? [];

  // -----------------------------------------
  // Membership requests
  // -----------------------------------------

  const membershipRequests =
    user?.membershipRequests ?? [];

  // -----------------------------------------
  // Membership state
  // -----------------------------------------

  const status =
    user?.activeMembershipStatus ??
    activeChurch?.status ??
    "none";

  const isActiveMember =
    user?.isMember ??
    status === "active";

  const isPendingMember =
    user?.isPending ??
    status === "pending";

  const isSuspendedMember =
    user?.isSuspended ??
    status === "suspended";

  const isTransferred =
    status === "transferred";

  // -----------------------------------------
  // Active membership request
  // -----------------------------------------

  const activeMembershipRequest =
    membershipRequests.find(
      (request) =>
        request.church_id ===
          activeChurchId &&
        request.status === "pending"
    ) ?? null;

  // -----------------------------------------
  // Rejected membership
  // -----------------------------------------

  const isRejectedMember =
    membershipRequests.some(
      (request) =>
        request.church_id ===
          activeChurchId &&
        request.status === "rejected"
    );

  // -----------------------------------------
  // Guest
  // -----------------------------------------

  const isGuest =
    !isActiveMember &&
    !isPendingMember &&
    !isSuspendedMember;

  // -----------------------------------------
  // Dashboard mode
  // -----------------------------------------

  const dashboardMode =
    isSuspendedMember
      ? "suspended"
      : isActiveMember
      ? "member"
      : isPendingMember
      ? "requested"
      : "guest";

  // -----------------------------------------
  // Access state
  // -----------------------------------------

  const getAccessState =
    useCallback(() => {
      if (isSuspendedMember) {
        return "suspended";
      }

      if (isActiveMember) {
        return "active";
      }

      if (isPendingMember) {
        return "pending";
      }

      return "guest";
    }, [
      isSuspendedMember,
      isActiveMember,
      isPendingMember,
    ]);

  return {

    activeChurch,
    activeChurchId,
    activeChurchName,
    churches,

    membershipRequests,
    activeMembershipRequest,

    departments:
      activeChurch?.departments ?? [],
    status,
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

