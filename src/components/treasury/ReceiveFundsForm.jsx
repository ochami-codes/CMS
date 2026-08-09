// src/components/treasury/ReceiveFundsForm.jsx

import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../Card";
import Button from "../Button";
import ErrorState from "../ErrorState";
import TextDisplay from "../TextDisplay";
import useCreateTransaction from "../../hooks/treasury/useCreateTransaction";
import useTreasuryFunds from "../../hooks/treasury/useTreasuryFunds";
import { useMembers } from "../../hooks/clerk/useMembers";

import styles from "../../styles/components/ReceiveFundsForm.module.css";

const createInitialForm = () => ({
  fund_id: "",
  amount: "",
  contributor_type: "member",
  member_id: "",
  contributor_name: "",
  phone_number: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
});

export default function ReceiveFundsForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(createInitialForm);

  const { createTransaction, saving } = useCreateTransaction();
  const {
    funds,
    isError: fundsError,
    error: fundsErrorDetails,
    refetch: refetchFunds,
  } = useTreasuryFunds();

  const {
    members,
    isError: membersError,
    error: membersErrorDetails,
    refetch: refetchMembers,
  } = useMembers();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.fund_id) {
      toast.error("Select a fund");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      await createTransaction({
        fund_id: form.fund_id,
        amount: Number(form.amount),
        type: "IN",
        contributor_type: form.contributor_type,
        member_id: form.member_id || null,
        contributor_name: form.contributor_name || null,
        phone_number: form.phone_number || null,
        date: form.date,
        notes: form.notes || null,
      });

      toast.success("Funds recorded successfully");
      setForm(createInitialForm());
      onSuccess?.();
    } catch {
      // Error toast is already handled by useCreateTransaction
    }
  };

  /* -------------------------
     ERROR STATES
  -------------------------- */
  if (fundsError || membersError) {
    return (
      <ErrorState
        title="Unable to load form data"
        message={
          fundsErrorDetails?.message ||
          membersErrorDetails?.message ||
          "Something went wrong while fetching data."
        }
        onRetry={() => {
          refetchFunds();
          refetchMembers();
        }}
      />
    );
  }

  /* -------------------------
     MAIN FORM
  -------------------------- */
  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <TextDisplay
          as="h2"
          size="2xl"
          weight="bold"
          color="primary"
        >
          Receive Funds
        </TextDisplay>
        <TextDisplay
          as="p"
          size="md"
          color="muted"
        >
          Record tithe, offerings and contributions
        </TextDisplay>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Fund */}
        <div className={styles.field}>
          <TextDisplay as="label" size="sm" color="muted">
            Fund
          </TextDisplay>
          <select
            name="fund_id"
            value={form.fund_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Fund</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className={styles.field}>
          <TextDisplay as="label" size="sm" color="muted">
            Amount
          </TextDisplay>
          <input
            type="number"
            name="amount"
            value={form.amount}
            min="1"
            onChange={handleChange}
            required
            placeholder="KES"
          />
        </div>

        {/* Contributor Type */}
        <div className={styles.field}>
          <label>Contributor</label>
          <select
            name="contributor_type"
            value={form.contributor_type}
            onChange={handleChange}
          >
            <option value="member">Member</option>
            <option value="guest">Guest</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>

        {/* Member Contributor */}
        {form.contributor_type === "member" && (
          <>
            <div className={styles.field}>
              <label>Member</label>
              <select
                name="member_id"
                value={form.member_id}
                onChange={handleChange}
              >
                <option value="">Select Member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Name Override</label>
              <input
                name="contributor_name"
                value={form.contributor_name}
                onChange={handleChange}
                placeholder="If member missing"
              />
            </div>
          </>
        )}

        {/* Guest Contributor */}
        {form.contributor_type === "guest" && (
          <>
            <div className={styles.field}>
              <label>Guest Name</label>
              <input
                name="contributor_name"
                value={form.contributor_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Phone</label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* Date */}
        <div className={styles.field}>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Notes */}
        <div className={styles.field}>
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
}