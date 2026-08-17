// src/pages/admin/TransfersRegister.jsx

import { useState } from "react";
import { formatDate } from "../../utils/formatDate";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import TransferDetailsCard from "../../components/members/TransferDetailsCard";
import TransferActionModal from "../../components/members/TransferActionModal";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";

import { useSourceTransfers } from "../../hooks/clerk/useSourceTransfers";
import { useDestinationTransfers } from "../../hooks/clerk/useDestinationTransfers";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";

import { RefreshCw, ArrowLeftRight } from "lucide-react";
import styles from "../../styles/pages/Clerk.module.css";

export default function TransfersRegister() {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedType, setSelectedType] = useState("in");
  const [actionType, setActionType] = useState(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const {
    transfers: sourceTransfers,
    loading: loadingSource,
    isError: isErrorSource,
    error: errorSource,
    refetch: refetchSource,
  } = useSourceTransfers();

  const {
    transfers: destinationTransfers,
    loading: loadingDestination,
    isError: isErrorDestination,
    error: errorDestination,
    refetch: refetchDestination,
  } = useDestinationTransfers();

  const {
  approveSourceTransfer,
  approveDestinationTransfer,
  rejectTransfer,
} = useClerkActions();

  const loading = loadingSource || loadingDestination;
  const isError = isErrorSource || isErrorDestination;
  const error = errorSource || errorDestination;

  const transferOuts = sourceTransfers;
  const transferIns = destinationTransfers;

  const refetchAll = async () => {
    await Promise.all([refetchSource(), refetchDestination()]);
  };

  /* -------------------------
     STATUS RENDERER
  -------------------------- */
  const statusRenderer = (value) => (
    <span className={styles[`status${value}`]}>{value}</span>
  );

  /* -------------------------
     COLUMNS
  -------------------------- */
  const transferInColumns = [
    { key: "member_name", label: "Name" },
    { key: "source_church_name", label: "From Church" },
    { key: "status", label: "Status", render: statusRenderer },
    { key: "created_at", label: "Date", render: formatDate },
  ];

  const transferOutColumns = [
    { key: "member_name", label: "Name" },
     {
    key: "destination_church_name",
    label: "To Church",
    render: (_, row) =>
      row.destination_church_name ||
      row.external_church_name ||
      "-",
  },
    { key: "status", label: "Status", render: statusRenderer },
    { key: "created_at", label: "Date", render: formatDate },
  ];

  /* -------------------------
     ACTIONS
  -------------------------- */
  const handleView = (transfer, type) => {
    setSelectedTransfer(transfer);
    setSelectedType(type);
  };

  const openApprove = (transfer) => {
    setSelectedTransfer(transfer);
    setActionType("approve");
  };

  const openReject = (transfer) => {
    setSelectedTransfer(transfer);
    setActionType("reject");
  };

  const handleSubmitAction = async () => {
  if (!selectedTransfer || !actionType) return;

  try {
    setActionLoading(true);

    if (actionType === "approve") {
      if (selectedType === "out") {
        await approveSourceTransfer({
          id: selectedTransfer.id,
          notes,
        });
      } else {
        await approveDestinationTransfer({
          id: selectedTransfer.id,
          notes,
        });
      }
    } else {
      await rejectTransfer({
        id: selectedTransfer.id,
        notes,
      });
    }

    setSelectedTransfer(null);
    setActionType(null);
    setNotes("");

    await refetchAll();
  } finally {
    setActionLoading(false);
  }
};
  const renderActions = (transfer, type) => (
    <div className={styles.actions}>
      <Button variant="primary" size="sm" onClick={() => handleView(transfer, type)}>
        View
      </Button>
    </div>
  );

  /* -------------------------
     LOADING
  -------------------------- */
  if (loading) {
    return (
      <div className={styles.pageCard}>
        <div className={styles.headerRow}>
          <h2 className={styles.cardTitle}>
            <ArrowLeftRight size={18} /> Transfers Register
          </h2>
        </div>
        <p>Loading transfers...</p>
      </div>
    );
  }

  /* -------------------------
     ERROR
  -------------------------- */
  if (isError) {
    return (
      <div className={styles.pageCard}>
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} /> Transfers Register
        </h2>
        <ErrorState
          title="Failed to load transfers"
          error={error}
          message={error?.message ?? "Something went wrong while fetching transfer data."}
          onRetry={refetchAll}
        />
      </div>
    );
  }

  /* -------------------------
     EMPTY STATE
  -------------------------- */
  if (transferOuts.length === 0 && transferIns.length === 0) {
    return (
      <div className={styles.pageCard}>
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} /> Transfers Register
        </h2>
        <EmptyState
          icon={<ArrowLeftRight size={28} />}
          title="No transfers found"
          message="No transfer requests have been recorded yet."
        />
      </div>
    );
  }

  /* -------------------------
     MAIN UI
  -------------------------- */
  return (
    <div className={styles.pageCard}>
      <div className={styles.headerRow}>
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} /> Transfers Register
        </h2>
      </div>

      {/* Transfer In */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Transfer In</h3>
        <ResponsiveDataView
          columns={transferInColumns}
          data={transferIns}
          renderActions={(t) => renderActions(t, "in")}
        />
      </div>

      {/* Transfer Out */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Transfer Out</h3>
        <ResponsiveDataView
          columns={transferOutColumns}
          data={transferOuts}
          renderActions={(t) => renderActions(t, "out")}
        />
      </div>

      {/* Details Modal */}
      {selectedTransfer && !actionType && (
        <TransferDetailsCard
          transfer={selectedTransfer}
          type={selectedType}
          onClose={() => setSelectedTransfer(null)}
          onOpenApproveModal={() => openApprove(selectedTransfer)}
          onOpenRejectModal={() => openReject(selectedTransfer)}
        />
      )}

      {/* Action Modal */}
      {actionType && selectedTransfer && (
        <TransferActionModal
          open
          action={actionType}
          notes={notes}
          setNotes={setNotes}
          onClose={() => {
            setActionType(null);
            setNotes("");
          }}
          onSubmit={handleSubmitAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
