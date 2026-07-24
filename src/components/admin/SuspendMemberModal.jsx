import { useState } from "react";

import Button from "../Button";
import Modal from "../Modal";

export default function SuspendMemberModal({
  member,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  if (!member) return null;

  async function handleConfirm() {
    await onConfirm( {
      memberId: member.id, 
      reason});

    setReason("");
  }

  function handleClose() {
    setReason("");
    onClose();
  }

  return (
    <Modal
      open
      onClose={handleClose}
      title={`Suspend ${member.full_name}`}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={handleConfirm}
          >
            Confirm Suspend
          </Button>
        </>
      }
    >
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        rows={4}
        style={{ width: "100%" }}
      />
    </Modal>
  );
}