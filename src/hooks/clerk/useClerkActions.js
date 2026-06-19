import { useState } from "react";
import { ClerkAPI } from "../../utils/api";

export function useClerkActions() {
  const [loading, setLoading] = useState({
  transfer: false,
  member: false,
  child: false,
  reportPreview: false,
  reportDownload: false,
});

  const [error, setError] = useState(null);

  /* =========================
     TRANSFERS
  ========================== */
  const createTransfer = async (payload) => {
    try {
      setLoading((p) => ({ ...p, transfer: true }));
      setError(null);
      return await ClerkAPI.createTransfer(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading((p) => ({ ...p, transfer: false }));
    }
  };

  const approveTransfer = async (id, notes = "") => {
    try {
      setLoading((p) => ({ ...p, transfer: true }));
      setError(null);
      return await ClerkAPI.approveTransfer(id, { notes });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading((p) => ({ ...p, transfer: false }));
    }
  };

  const rejectTransfer = async (id, notes = "") => {
    try {
      setLoading((p) => ({ ...p, transfer: true }));
      setError(null);
      return await ClerkAPI.rejectTransfer(id, { notes });
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading((p) => ({ ...p, transfer: false }));
    }
  };

  /* =========================
     MEMBERS
  ========================== */
  const updateMember = async (memberId, payload) => {
    try {
      setLoading((p) => ({ ...p, member: true }));
      setError(null);
      return await ClerkAPI.updateMember(memberId, payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading((p) => ({ ...p, member: false }));
    }
  };

  /* =========================
     CHILDREN
  ========================== */
  const updateChild = async (childId, payload) => {
    try {
      setLoading((p) => ({ ...p, child: true }));
      setError(null);
      return await ClerkAPI.updateChild(childId, payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading((p) => ({ ...p, child: false }));
    }
  };

 /* =========================
     REPORTS
  ========================== */

const generateReport = async (params) => {
  try {
    setLoading((p) => ({ ...p, reportPreview: true }));
    setError(null);

    return await ClerkAPI.generateReport({
      ...params,
      format: "json",
    });
  } catch (err) {
    setError(err);
    throw err;
  } finally {
    setLoading((p) => ({ ...p, reportPreview: false }));
  }
};

const downloadReport = async (params, filename = "church-report.pdf") => {
  try {
    setLoading((p) => ({ ...p, reportDownload: true }));
    setError(null);

    const blob = await ClerkAPI.downloadReport({
      ...params,
      format: "pdf",
    });

    if (!(blob instanceof Blob)) {
      throw new Error("Invalid response: expected PDF blob");
    }

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    return true;
  } catch (err) {
    setError(err);
    throw err; // optional but useful if caller wants to react
  } finally {
    setLoading((p) => ({ ...p, reportDownload: false }));
  }
};
  return {
    createTransfer,
    approveTransfer,
    rejectTransfer,
    updateMember,
    updateChild,
    generateReport,
    downloadReport,
    loading,
    error,
  };
}