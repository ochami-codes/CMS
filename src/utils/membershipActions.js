// src/utils/membershipActions.js
import { MembershipAPI } from "./api";

/**
 * Respond to a membership invite
 * @param {Object} params
 * @param {string} params.requestId
 * @param {"accepted"|"rejected"} params.action
 * @param {Function} [params.refreshUser]
 * @param {Function} [params.onSuccess]
 * @param {Function} [params.onError]
 */
export const respondToInvite = async ({
  requestId,
  action,
  refreshUser,
  onSuccess,
  onError,
}) => {
  try {
    const res = await MembershipAPI.respondInvite(requestId, action);

    // 🔥 Keep app state in sync (important)
    if (refreshUser) {
      await refreshUser();
    }

    if (onSuccess) {
      onSuccess(res);
    }

    return res;
  } catch (err) {
    console.error("Respond invite failed:", err);

    if (onError) {
      onError(err);
    }

    throw err;
  }
};
