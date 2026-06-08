import { useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useClerkActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTransfer = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      return await ClerkAPI.createTransfer(payload);
    } finally {
      setLoading(false);
    }
  };

  const approveTransfer = async (id, notes = "") => {
    try {
      setLoading(true);
      setError(null);

      return await ClerkAPI.approveTransfer(id, { notes });
    } finally {
      setLoading(false);
    }
  };

  const rejectTransfer = async (id, notes = "") => {
    try {
      setLoading(true);
      setError(null);

      return await ClerkAPI.rejectTransfer(id, { notes });
    } finally {
      setLoading(false);
    }
  };
  const updateMember = async (
  memberId,
  payload
) => {
  try {
    setLoading(true);
    setError(null);

    return await ClerkAPI.updateMember(
      memberId,
      payload
    );
  } catch (err) {
    setError(err);
    throw err;
  } finally {
    setLoading(false);
  }
};

 const updateChild = async (
  childId,
  payload
) => {
  try {
    setLoading(true);
    setError(null);

    return await ClerkAPI.updateChild(
      childId,
      payload
    );
  } catch (err) {
    setError(err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    createTransfer,
    approveTransfer,
    rejectTransfer,
    updateMember,
    loading,
    error,
    updateChild
  };
}