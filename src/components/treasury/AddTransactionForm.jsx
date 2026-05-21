import { useEffect, useState } from "react";
import { TreasuryAPI } from "../../utils/api";

export default function AddTransactionForm({ onSuccess }) {
  const [groups, setGroups] = useState([]);
  const [funds, setFunds] = useState([]);

  const [form, setForm] = useState({
    type: "income",
    group_id: "",
    fund_id: "",
    amount: "",
    date: "",
    reference: "",
    notes: "",
  });

  useEffect(() => {
    TreasuryAPI.fundGroups().then(setGroups);
  }, []);

  useEffect(() => {
    if (form.group_id) {
      TreasuryAPI.fundsByGroup(form.group_id).then(setFunds);
    } else {
      setFunds([]);
      setForm(prev => ({ ...prev, fund_id: "" }));
    }
  }, [form.group_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await TreasuryAPI.createTransaction({
      fund_id: form.fund_id,
      type: form.type,
      amount: Number(form.amount),
      date: form.date,
      reference: form.reference,
      notes: form.notes,
    });

    onSuccess?.();
  };

  return (
    <div className="page-container">
      <form className="page-card" onSubmit={submit}>
        <h3 className="card-title">Add Transaction</h3>

        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label>Fund Group</label>
          <select
            name="group_id"
            value={form.group_id}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Fund Group</option>
            {groups.map((g) => (
              <option key={g.group_id} value={g.group_id}>
                {g.group_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fund</label>
          <select
            name="fund_id"
            value={form.fund_id}
            onChange={handleChange}
            className="input-field"
            required
            disabled={!form.group_id}
          >
            <option value="">Select Fund</option>
            {funds.map((f) => (
              <option key={f.fund_id} value={f.fund_id}>
                {f.fund_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label>Reference</label>
          <input
            type="text"
            name="reference"
            value={form.reference}
            onChange={handleChange}
            placeholder="Reference (optional)"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="input-field"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Transaction
        </button>
      </form>
    </div>
  );
}
