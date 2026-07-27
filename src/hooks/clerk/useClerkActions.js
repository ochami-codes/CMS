import { useMutation } from "@tanstack/react-query";
import { ClerkAPI } from "../../utils/api";

export function useClerkActions() {
  /* =========================
     TRANSFERS
  ========================== */

  const createTransferMutation = useMutation({
    mutationFn: ClerkAPI.createTransfer,
  });

  const approveTransferMutation = useMutation({
    mutationFn: ({ id, notes = "" }) =>
      ClerkAPI.approveTransfer(id, { notes }),
  });

  const rejectTransferMutation = useMutation({
    mutationFn: ({ id, notes = "" }) =>
      ClerkAPI.rejectTransfer(id, { notes }),
  });

  /* =========================
     MEMBERS
  ========================== */

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, payload }) =>
      ClerkAPI.updateMember(
        memberId,
        payload
      ),
  });

  /* =========================
     CHILDREN
  ========================== */

  const updateChildMutation = useMutation({
    mutationFn: ({ childId, payload }) =>
      ClerkAPI.updateChild(
        childId,
        payload
      ),
  });

  /* =========================
     REPORT PREVIEW
  ========================== */

  const generateReportMutation = useMutation({
    mutationFn: (params) =>
      ClerkAPI.generateReport({
        ...params,
        format: "json",
      }),
  });

  /* =========================
     REPORT DOWNLOAD
  ========================== */

  const downloadReportMutation = useMutation({
    mutationFn: async ({
      params,
      filename = "church-report.pdf",
    }) => {
      const blob =
        await ClerkAPI.downloadReport({
          ...params,
          format: "pdf",
        });

      if (!(blob instanceof Blob)) {
        throw new Error(
          "Invalid response: expected PDF blob"
        );
      }

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);

      return true;
    },
  });

  return {
    /* =========================
       ACTIONS
    ========================== */

    createTransfer:
      createTransferMutation.mutateAsync,

    approveTransfer:
      approveTransferMutation.mutateAsync,

    rejectTransfer:
      rejectTransferMutation.mutateAsync,

    updateMember:
      updateMemberMutation.mutateAsync,

    updateChild:
      updateChildMutation.mutateAsync,

    generateReport:
      generateReportMutation.mutateAsync,

    downloadReport:
      downloadReportMutation.mutateAsync,

    /* =========================
       LOADING
    ========================== */

    loading: {
      transfer:
        createTransferMutation.isPending ||
        approveTransferMutation.isPending ||
        rejectTransferMutation.isPending,

      member:
        updateMemberMutation.isPending,

      child:
        updateChildMutation.isPending,

      reportPreview:
        generateReportMutation.isPending,

      reportDownload:
        downloadReportMutation.isPending,
    },

    /* =========================
       ERRORS
    ========================== */

    error: {
      transfer:
        createTransferMutation.error ||
        approveTransferMutation.error ||
        rejectTransferMutation.error,

      member:
        updateMemberMutation.error,

      child:
        updateChildMutation.error,

      reportPreview:
        generateReportMutation.error,

      reportDownload:
        downloadReportMutation.error,
    },

    /* =========================
       ERROR FLAGS
    ========================== */

    isError: {
      transfer:
        createTransferMutation.isError ||
        approveTransferMutation.isError ||
        rejectTransferMutation.isError,

      member:
        updateMemberMutation.isError,

      child:
        updateChildMutation.isError,

      reportPreview:
        generateReportMutation.isError,

      reportDownload:
        downloadReportMutation.isError,
    },
  };
}