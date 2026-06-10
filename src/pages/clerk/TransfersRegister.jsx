import { useState } from "react";
import { formatDate } from "../../utils/formatDate";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import TransferDetailsCard from "../../components/members/TransferDetailsCard";
import TransferActionModal from "../../components/members/TransferActionModal";
import TransferRequestModal from "../../components/members/TransferRequestModal";
import EmptyState from "../../components/EmptyState";
import { useToast } from "../../components/ToastProvider";
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
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const {
  transfers: sourceTransfers,
  loading: loadingSource,
  error: errorSource,
   refetchSource,
} = useSourceTransfers();

const {
  transfers: destinationTransfers,
  loading: loadingDestination,
  error: errorDestination,
 refetchDestination,
} = useDestinationTransfers();
  const { approveTransfer, rejectTransfer, createTransfer } =
    useClerkActions();
  const { showToast } = useToast();
  const loading = loadingSource || loadingDestination;
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
    { key: "destination_church_name", label: "To Church" },
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

  const handleCreateTransfer = async (payload) => {
  try {
    await createTransfer(payload);
    showToast("Transfer created successfully", "success");
    setOpenTransferModal(false);
    await refetchAll();
  } catch (err) {
    showToast(err?.message || "Failed to create transfer", "error");
  }
};

  const handleSubmitAction = async () => {
  if (!selectedTransfer || !actionType) return;

  const isApprove = actionType === "approve";

  try {
    setActionLoading(true);

    if (isApprove) {
      await approveTransfer(selectedTransfer.id, notes);
    } else {
      await rejectTransfer(selectedTransfer.id, notes);
    }

    showToast(
      `Transfer ${isApprove ? "approved" : "rejected"} successfully`,
      "success"
    );

    setSelectedTransfer(null);
    setActionType(null);
    setNotes("");

    await refetchAll();
  } catch (err) {
    showToast(
      err?.message || "Action failed. Please try again.",
      "error"
    );
  } finally {
    setActionLoading(false);
  }
};
  const renderActions = (transfer, type) => (
    <div className={styles.actions}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleView(transfer, type)}
      >
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
            <ArrowLeftRight size={18} />
            Transfers Register
          </h2>

          <Button
            variant="primary"
            onClick={() => setOpenTransferModal(true)}
          >
            + Manual Transfer
          </Button>
        </div>

        <p>Loading transfers...</p>
      </div>
    );
  }

  /* -------------------------
     ERROR
  -------------------------- */
  if (error) {
    return (
      <div className={styles.pageCard}>
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} />
          Transfers Register
        </h2>

        <EmptyState
          icon={<ArrowLeftRight size={28} />}
          title="Failed to load transfers"
          message="Something went wrong while fetching transfer data."
          action={
            <Button variant="primary" onClick={refetchAll}>
              <RefreshCw size={16} />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  /* -------------------------
     EMPTY STATE
  -------------------------- */
  if (sourceTransfers.length === 0 && destinationTransfers.length === 0) {
    return (
      <div className={styles.pageCard}>
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} />
          Transfers Register
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
    <ArrowLeftRight size={18} />
    Transfers Register
  </h2>

  <Button
    variant="primary"
    onClick={() => setOpenTransferModal(true)}
  >
    + Manual Transfer
  </Button>
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
          open={true}
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

      {/* Create Transfer Modal */}
      {openTransferModal && (
        <TransferRequestModal
          isOpen={true}
          onClose={() => setOpenTransferModal(false)}
          onSubmit={handleCreateTransfer}
        />
      )}
    </div>
  );
}