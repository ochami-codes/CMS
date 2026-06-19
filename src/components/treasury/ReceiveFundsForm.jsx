import { useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../Card";
import Button from "../Button";

import { TreasuryAPI } from "../../utils/api";
import useTreasuryFunds from "../../hooks/treasury/useTreasuryFunds";
import { useMembers } from "../../hooks/clerk/useMembers";

import styles from "../../styles/components/ReceiveFundsForm.module.css";

const INITIAL_FORM = {
  fund_id: "",
  amount: "",
  contributor_type: "member",
  member_id: "",
  contributor_name: "",
  phone_number: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
};

export default function ReceiveFundsForm({
  onSuccess,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const { funds } = useTreasuryFunds();
  const { members } = useMembers();


  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;
setLoading(true);

    try {
      await TreasuryAPI.createTransaction({
        fund_id: form.fund_id,
        amount: Number(form.amount),
        type: "income",
        contributor_type:
          form.contributor_type,
        member_id:
          form.member_id || null,
        contributor_name:
          form.contributor_name || null,
        phone_number:
          form.phone_number || null,
        date: form.date,
        notes: form.notes,
      });

      toast.success(
        "Funds recorded successfully"
      );

      onSuccess?.();
    } catch (error) {
      toast.error(
        error.message ||
          "Failed recording funds"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2>Receive Funds</h2>
          <p>
            Record tithe, offerings and
            other contributions
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        {/* Fund */}
        <div className={styles.field}>
          <label>Fund</label>

          <select
            name="fund_id"
            value={form.fund_id}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Fund
            </option>

            {funds.map((fund) => (
              <option
                key={fund.id}
                value={fund.id}
              >
                {fund.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className={styles.field}>
          <label>Amount</label>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="1"
            required
            placeholder="KES"
          />
        </div>

        {/* Contributor Type */}
        <div className={styles.field}>
          <label>
            Contributor Type
          </label>

          <select
            name="contributor_type"
            value={
              form.contributor_type
            }
            onChange={handleChange}
          >
            <option value="member">
              Member
            </option>

            <option value="guest">
              Guest
            </option>

            <option value="anonymous">
              Anonymous
            </option>
          </select>
        </div>

        {/* Member */}
        {form.contributor_type ===
          "member" && (
          <>
            <div
              className={styles.field}
            >
              <label>Member</label>

              <select
                name="member_id"
                value={form.member_id}
                onChange={handleChange}
              >
                <option value="">
                  Select Member
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {
                        member.full_name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              className={styles.field}
            >
              <label>
                Member Not Listed
              </label>

              <input
                name="contributor_name"
                value={
                  form.contributor_name
                }
                onChange={handleChange}
                placeholder="Enter member name"
              />
            </div>
          </>
        )}

        {/* Guest */}
        {form.contributor_type ===
          "guest" && (
          <>
            <div
              className={styles.field}
            >
              <label>
                Guest Name
              </label>

              <input
                name="contributor_name"
                value={
                  form.contributor_name
                }
                onChange={handleChange}
                required
              />
            </div>

            <div
              className={styles.field}
            >
              <label>
                Phone Number
              </label>

              <input
                name="phone_number"
                value={
                  form.phone_number
                }
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
          </>
        )}

        {/* Anonymous */}
        {form.contributor_type ===
          "anonymous" && (
          <div
            className={`${styles.field} ${styles.full}`}
          >
            <p className={styles.helper}>
              This contribution will
              be recorded as anonymous.
            </p>
          </div>
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
        <div
          className={`${styles.field} ${styles.full}`}
        >
          <label>Notes</label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes"
          />
        </div>

        <div className={styles.actions}>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}

          <Button disabled={loading}>
            <Save size={16} />

            {loading
              ? "Saving..."
              : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  );
}