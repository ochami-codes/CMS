import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import { useState } from "react";
import styles from "../../styles/pages/Clerk.module.css";
export default function TransfersRegister() {
  const [transfers, setTransfers] = useState([
    {
      id: 1,
      name: "Mary Smith",
      from: "Westlands SDA",
      to: "Nairobi Central",
      status: "Pending",
      date: "2026-05-20",
    },
  ]);

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "from",
      label: "From",
    },
    {
      key: "to",
      label: "To",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className={`status-${value.toLowerCase()}`}>
          {value}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
    },
  ];

  const handleApprove = (transfer) => {
    console.log("Approve", transfer);
  };

  const handleReject = (transfer) => {
    console.log("Reject", transfer);
  };

  const handleView = (transfer) => {
    console.log("View", transfer);
  };

  const renderActions = (transfer) => (
    <div className={styles.actions}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleView(transfer)}
      >
        View
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleApprove(transfer)}
      >
        Approve
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => handleReject(transfer)}
      >
        Reject
      </Button>
    </div>
  );

  return (
    <div className={styles.pageCard}>
      <h2 className={styles.cardTitle}>🔁 Transfers Register</h2>

      <ResponsiveDataView
        columns={columns}
        data={transfers}
        renderActions={renderActions}
      />
    </div>
  );
}
