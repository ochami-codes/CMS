import { useState } from "react";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";

import TransferDetailsCard from "../../components/members/TransferDetailsCard";

import styles from "../../styles/pages/Clerk.module.css";

export default function TransfersRegister() {

  const [selectedTransfer, setSelectedTransfer] =
    useState(null);

  const [selectedType, setSelectedType] =
    useState("in");

  const [transferIns] = useState([
    {
      id: 1,
      name: "Mary Smith",
      from: "Westlands SDA",
      to: "Nairobi Central",
      status: "Pending",
      date: "2026-05-20",
      role: "Member",
      phone: "0712345678",
      reason:
        "Relocated closer to Nairobi Central Church.",
    },
  ]);

  const [transferOuts] = useState([
    {
      id: 2,
      name: "John Doe",
      from: "Nairobi Central",
      to: "Karen SDA",
      status: "Approved",
      date: "2026-05-18",
      role: "Elder",
      phone: "0700111222",
      reason:
        "Transferred due to family relocation.",
    },
  ]);

  const statusRenderer = (value) => (
    <span
      className={
        styles[`status${value}`]
      }
    >
      {value}
    </span>
  );

  const transferInColumns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "from",
      label: "From Church",
    },
    {
      key: "status",
      label: "Status",
      render: statusRenderer,
    },
    {
      key: "date",
      label: "Date",
    },
  ];

  const transferOutColumns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "to",
      label: "To Church",
    },
    {
      key: "status",
      label: "Status",
      render: statusRenderer,
    },
    {
      key: "date",
      label: "Date",
    },
  ];

  const handleView = (
    transfer,
    type
  ) => {
    setSelectedTransfer(transfer);
    setSelectedType(type);
  };

  const handleApprove = (transfer) => {
    console.log(
      "Approve transfer:",
      transfer
    );
  };

  const handleReject = (transfer) => {
    console.log(
      "Reject transfer:",
      transfer
    );
  };

  const renderActions = (
    transfer,
    type
  ) => (
    <div className={styles.actions}>
      <Button
        variant="primary"
        size="sm"
        onClick={() =>
          handleView(
            transfer,
            type
          )
        }
      >
        View
      </Button>
    </div>
  );

  return (
    <div className={styles.pageCard}>

      <h2 className={styles.cardTitle}>
        🔁 Transfers Register
      </h2>

      {/* Transfer In */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Transfer In
        </h3>

        <ResponsiveDataView
          columns={transferInColumns}
          data={transferIns}
          renderActions={(transfer) =>
            renderActions(
              transfer,
              "in"
            )
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
          renderActions={(transfer) =>
            renderActions(
              transfer,
              "out"
            )
          }
        />
      </div>

      {/* Transfer Details Modal */}
      {selectedTransfer && (
        <TransferDetailsCard
          transfer={selectedTransfer}
          type={selectedType}
          onClose={() =>
            setSelectedTransfer(null)
          }
          onApprove={() =>
            handleApprove(
              selectedTransfer
            )
          }
          onReject={() =>
            handleReject(
              selectedTransfer
            )
          }
        />
      )}

    </div>
  );
}
