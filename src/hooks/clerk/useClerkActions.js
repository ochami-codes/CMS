import { useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useClerkActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------
     CREATE TRANSFER
  -------------------------- */
  const createTransfer = async (payload) => {
    try {
      setLoading(true);
      const data = await ClerkAPI.createTransfer(payload);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------
     UPDATE TRANSFER STATUS
  -------------------------- */
  const updateTransferStatus = async (id, payload) => {
    try {
      setLoading(true);
      const data = await ClerkAPI.updateTransferStatus(id, payload);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTransfer,
    updateTransferStatus,
    loading,
    error,
  };
}