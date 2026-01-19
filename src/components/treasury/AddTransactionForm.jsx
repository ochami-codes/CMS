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
    <form className="card" onSubmit={submit}>
      <h3>Add Transaction</h3>

      <select name="type" onChange={handleChange}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        name="group_id"
        onChange={handleChange}
        required
      >
        <option value="">Select Fund Group</option>
        {groups.map((g) => (
          <option key={g.group_id} value={g.group_id}>
            {g.group_name}
          </option>
        ))}
      </select>

      <select
        name="fund_id"
        onChange={handleChange}
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

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        required
        onChange={handleChange}
      />

      <input
        type="date"
        name="date"
        required
        onChange={handleChange}
      />

      <input
        type="text"
        name="reference"
        placeholder="Reference (optional)"
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes (optional)"
        onChange={handleChange}
      />

      <button type="submit">Save Transaction</button>
    </form>
  );
}

