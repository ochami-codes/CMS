import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../../styles/global.css";
export default function PastorDashboard() {
  const [youthCount, setYouthCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: youth } = await supabase
        .from("members")
        .select("id", { count: "exact" })
        .eq("department", "youth");

      const { count: children } = await supabase
        .from("members")
        .select("id", { count: "exact" })
        .eq("department", "children");

      setYouthCount(youth || 0);
      setChildrenCount(children || 0);
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-layout">
      <h1 className="page-title">Pastor Dashboard</h1>
      <p className="page-subtext">
        Overview of church departments and members.
      </p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Youth Department</h3>
          <p>Total members: {youthCount}</p>
        </div>

        <div className="stat-card">
          <h3>Children Department</h3>
          <p>Total members: {childrenCount}</p>
        </div>

        <div className="stat-card">
          <h3>Reports</h3>
          <p>Generate overall church reports and attendance summaries.</p>
        </div>
      </div>
    </div>
  );
}
