import { useState } from "react";
import Modal from "../Modal";
import Button from "../Button";

export default function TransferActionModal({
  open,
  action,
  onClose,
  onSubmit,
}) {
  const [notes, setNotes] =
    useState("");

  if (!open) return null;

  const isApprove =
    action === "approve";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isApprove
          ? "Approve Transfer"
          : "Reject Transfer"
      }
    >
      <p>
        {isApprove
          ? "Approve this transfer request?"
          : "Reject this transfer request?"}
      </p>

      <textarea
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        placeholder={
          isApprove
            ? "Approval notes (optional)"
            : "Reason for rejection"
        }
      />

      <div>
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant={
            isApprove
              ? "secondary"
              : "danger"
          }
          onClick={() =>
            onSubmit({
              notes,
            })
          }
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}