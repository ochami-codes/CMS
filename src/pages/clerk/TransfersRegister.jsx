import { useState, useMemo } from "react";
import  { formatDate }  from "../../utils/formatDate";
import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import TransferDetailsCard from "../../components/members/TransferDetailsCard";
import EmptyState from "../../components/EmptyState";

import { useTransfers } from "../../hooks/clerk/useTransfers";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";

import { RefreshCw, ArrowLeftRight } from "lucide-react";

import styles from "../../styles/pages/Clerk.module.css";

export default function TransfersRegister() {
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedType, setSelectedType] = useState("in");

  const {
    transfers,
    loading,
    error,
    refetch,
  } = useTransfers();

  const {
    updateTransferStatus,
  } = useClerkActions();

  /* -------------------------
     SPLIT TRANSFERS
  -------------------------- */
  const transferIns = useMemo(
    () =>
      transfers?.filter(
        (t) =>
          t.transfer_type === "transfer_in"
      ) || [],
    [transfers]
  );

  const transferOuts = useMemo(
    () =>
      transfers?.filter(
        (t) =>
          t.transfer_type === "transfer_out"
      ) || [],
    [transfers]
  );

  /* -------------------------
     STATUS RENDERER
  -------------------------- */
  const statusRenderer = (value) => (
    <span
      className={
        styles[`status${value}`]
      }
    >
      {value}
    </span>
  );

  /* -------------------------
     COLUMNS
  -------------------------- */
  const transferInColumns = [
    { key: "member_name", label: "Name" },
    { key: "source_church_name", label: "From Church" },
    {
      key: "status",
      label: "Status",
      render: statusRenderer,
    },
    { key: "created_at",
       label: "Date",
       render: formatDate,
      },
  ];

  const transferOutColumns = [
    { key: "member_name", label: "Name" },
    { key: "destination_church_name", label: "To Church" },
    {
      key: "status",
      label: "Status",
      render: statusRenderer,
    },
    { key: "created_at",
       label: "Date",
       render: formatDate,
      },
  ];

  /* -------------------------
     ACTIONS
  -------------------------- */
  const handleView = (transfer, type) => {
    setSelectedTransfer(transfer);
    setSelectedType(type);
  };

  const handleApprove = async (transfer) => {
    await updateTransferStatus(transfer.id, {
      status: "approved",
    });
    refetch();
  };

  const handleReject = async (transfer) => {
    await updateTransferStatus(transfer.id, {
      status: "rejected",
    });
    refetch();
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
        <h2 className={styles.cardTitle}>
          <ArrowLeftRight size={18} />
          Transfers Register
        </h2>

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
            <Button
              variant="primary"
              onClick={refetch}
            >
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
  if (!transfers || transfers.length === 0) {
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
      <h2 className={styles.cardTitle}>
        <ArrowLeftRight size={18} />
        Transfers Register
      </h2>

      {/* Transfer In */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Transfer In
        </h3>

        <ResponsiveDataView
          columns={transferInColumns}
          data={transferIns}
          renderActions={(t) =>
            renderActions(t, "in")
          }
        />
      </div>

      {/* Transfer Out */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Transfer Out
        </h3>

        <ResponsiveDataView
          columns={transferOutColumns}
          data={transferOuts}
          renderActions={(t) =>
            renderActions(t, "out")
          }
        />
      </div>

      {/* Details Modal */}
      {selectedTransfer && (
        <TransferDetailsCard
          transfer={selectedTransfer}
          type={selectedType}
          onClose={() => setSelectedTransfer(null)}
          onApprove={() =>
            handleApprove(selectedTransfer)
          }
          onReject={() =>
            handleReject(selectedTransfer)
          }
        />
      )}
    </div>
  );
}