import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../../styles/global.css";
export default function TreasuryDashboard() {
  const [offerings, setOfferings] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: offeringsData } = await supabase.from("offerings").select("*");
      const { data: expensesData } = await supabase.from("expenses").select("*");

      setOfferings(offeringsData || []);
      setExpenses(expensesData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading treasury data...</p>;

  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Treasury Department</h1>
      <p className="page-subtext">
        View offerings, expenses, and financial reports.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Offerings</h3>
          <p>Total offerings collected: {offerings.length}</p>
        </div>

        <div className="stat-card">
          <h3>Expenses</h3>
          <p>Total expenses recorded: {expenses.length}</p>
        </div>

        <div className="stat-card">
          <h3>Reports</h3>
          <p>Generate financial statements and summaries.</p>
        </div>
      </div>
    </div>
  );
}