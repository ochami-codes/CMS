import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { ClerkAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

export function useClerkActions() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  /* =========================
     TRANSFERS
  ========================== */

  const createTransferMutation = useMutation({
    mutationFn: ClerkAPI.createTransfer,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-transfers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });

      showToast(
        "Transfer created successfully"
      );
    },
  });
  const createClerkTransferMutation = useMutation({
    mutationFn: ClerkAPI.createClerkTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-transfers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });
      showToast(
        "Transfer created successfully"
      );
    }
  });

  const approveSourceTransferMutation = useMutation({
  mutationFn: ({ id, notes = "" }) =>
    ClerkAPI.approveSourceTransfer(id, {
      notes,
    }),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["clerk-transfers"],
    });

    queryClient.invalidateQueries({
      queryKey: ["clerk-members"],
    });

    showToast("Transfer approved successfully");
  },

  onError: (error) => {
    showToast(
      error?.message ||
        "Failed to approve transfer.",
      { type: "error" }
    );
  },
});
const approveDestinationTransferMutation = useMutation({
  mutationFn: ({ id, notes = "" }) =>
   ClerkAPI.approveDestinationTransfer(
      id,
      { notes }
    
   ),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["clerk-transfers"],
    });

    queryClient.invalidateQueries({
      queryKey: ["clerk-members"],
    });

    showToast("Transfer approved successfully");
  },

  onError: (error) => {
    showToast(
      error?.message ||
        "Failed to approve transfer.",
      { type: "error" }
    );
  },
});

  const rejectTransferMutation = useMutation({
    mutationFn: ( {id, notes = ""} ) =>
      ClerkAPI.rejectTransfer(id, { notes }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-transfers"],
      });

      showToast(
        "Transfer rejected successfully",
      );
    },
  });

  /* =========================
     MEMBERS
  ========================== */

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, payload }) =>
      ClerkAPI.updateMember({
        memberId,
        payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });

      showToast(
        "Member updated successfully",
      );
    },
  });

  /* =========================
     CHILDREN
  ========================== */

  const addChildMutation = useMutation({
    mutationFn: ClerkAPI.addChild,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-children"],
      });

      queryClient.invalidateQueries({
        queryKey: ["clerk-members"],
      });

      showToast(
        "Child registered successfully");
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ childId, payload }) =>
      ClerkAPI.updateChild(
        childId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clerk-children"],
      });

      showToast(
        "Child updated successfully"
      );
    },
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

    onSuccess: () => {
      showToast(
        "Report generated successfully"
      );
    },
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

    onSuccess: () => {
      showToast(
        "Report downloaded successfully"
      );
    },
  });

  return {
    /* =========================
       ACTIONS
    ========================== */

    createTransfer:
      createTransferMutation.mutateAsync,
    createClerkTransfer:
      createClerkTransferMutation.mutateAsync,
    approveSourceTransfer:
      approveSourceTransferMutation.mutateAsync,

    approveDestinationTransfer:
      approveDestinationTransferMutation.mutateAsync,  

    rejectTransfer:
      rejectTransferMutation.mutateAsync,

    updateMember:
      updateMemberMutation.mutateAsync,

    addChild:
      addChildMutation.mutateAsync,

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
      createTransfer:
        createTransferMutation.isPending,
      createClerkTransfer:
        createClerkTransferMutation.isPending,
      approveSourceTransfer:
        approveSourceTransferMutation.isPending,

      approveDestinationTransfer:
        approveDestinationTransferMutation.isPending,  

      rejectTransfer:
        rejectTransferMutation.isPending,

      updateMember:
        updateMemberMutation.isPending,

      addChild:
        addChildMutation.isPending,

      updateChild:
        updateChildMutation.isPending,

      generateReport:
        generateReportMutation.isPending,

      downloadReport:
        downloadReportMutation.isPending,
    },

    /* =========================
       ERRORS
    ========================== */

    error: {
      createTransfer:
        createTransferMutation.error,
      createClerkTransfer:
        createClerkTransferMutation.error,
      approveSourceTransfer:
        approveSourceTransferMutation.error,

      approveDestinationTransfer:
        approveDestinationTransferMutation,  

      rejectTransfer:
        rejectTransferMutation.error,

      updateMember:
        updateMemberMutation.error,

      addChild:
        addChildMutation.error,

      updateChild:
        updateChildMutation.error,

      generateReport:
        generateReportMutation.error,

      downloadReport:
        downloadReportMutation.error,
    },

    /* =========================
       ERROR FLAGS
    ========================== */

    isError: {
      createTransfer:
        createTransferMutation.isError,

      approveSourceTransfer:
        approveSourceTransferMutation.isError,
      approveDestinationTransfer:
        approveDestinationTransferMutation.isError,  

      rejectTransfer:
        rejectTransferMutation.isError,

      updateMember:
        updateMemberMutation.isError,

      addChild:
        addChildMutation.isError,

      updateChild:
        updateChildMutation.isError,

      generateReport:
        generateReportMutation.isError,

      downloadReport:
        downloadReportMutation.isError,
    },
  };
}