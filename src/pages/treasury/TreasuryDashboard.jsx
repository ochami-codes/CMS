// src/pages/treasury/TreasuryDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import RequirePermission from "../../components/RequirePermission";
import { TreasuryAPI } from "../../utils/api";
import FundGroupChart from "../../components/treasury/FundGroupChart";
import FundBreakdownChart from "../../components/treasury/FundBreakdownChart";
import AddTransactionForm from "../../components/treasury/AddTransactionForm";
import DateFilter from "../../components/treasury/DateFilter";
import { generateTablePDF } from "../../utils/pdf";
import toast from "react-hot-toast";

export default function TreasuryDashboard() {
  const { profile } = useAuth();

  const [overview, setOverview] = useState(null);
  const [groups, setGroups] = useState([]);
  const [funds, setFunds] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filter, setFilter] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);

  const params =
    filter.start || filter.end
      ? `?start=${filter.start}&end=${filter.end}`
      : "";

  // ----------------- Load all dashboard data -----------------
  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewData, groupsData, membersData] = await Promise.all([
        TreasuryAPI.overview(params),
        TreasuryAPI.fundGroups(params),
        TreasuryAPI.memberGivingSummary(params),
      ]);

      setOverview(overviewData || null);
      setGroups(groupsData || []);
      setMembers(membersData || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load treasury dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Load funds for selected group -----------------
  useEffect(() => {
    if (!selectedGroup) return;

    const loadFunds = async () => {
      try {
        const data = await TreasuryAPI.fundsByGroup(selectedGroup, params);
        setFunds(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load funds: " + err.message);
        setFunds([]);
      }
    };

    loadFunds();
  }, [selectedGroup, params]);

  useEffect(() => {
    loadData();
  }, [params]);

  // ----------------- Download PDF -----------------
  const downloadMembersPDF = () => {
    if (!members.length) return toast.error("No member data to export.");

    generateTablePDF(
      "Member Giving Summary",
      ["Member", "Total Given", "Last Given"],
      members.map((m) => [m.full_name, m.total_given, m.last_given])
    );
  };

  if (loading) return <p>Loading treasury dashboard…</p>;

  return (
    <RequirePermission permission="view_finances">
      <div className="dashboard-layout">
        <h1 className="page-title">Treasury Dashboard</h1>
        <p className="page-subtext">
          Financial overview based on church funds and transactions
        </p>

        {/* DATE FILTER */}
        <DateFilter onChange={setFilter} />

        {/* SNAPSHOT */}
        {overview && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Income</h3>
              <p>KES {overview.total_income?.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Total Expenses</h3>
              <p>KES {overview.total_expenses?.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Balance</h3>
              <p>KES {overview.balance?.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Active Funds</h3>
              <p>{overview.active_funds ?? 0}</p>
            </div>
          </div>
        )}

        {/* FUND GROUP OVERVIEW */}
        <div className="card">
          <h3>Fund Group Overview</h3>
          <FundGroupChart data={groups} />
        </div>

        {/* FUND BREAKDOWN */}
        <div className="card">
          <h3>Fund Breakdown</h3>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select Fund Group</option>
            {groups.map((g) => (
              <option key={g.group_id} value={g.group_id}>
                {g.group_name}
              </option>
            ))}
          </select>

          {funds.length > 0 && <FundBreakdownChart data={funds} />}
        </div>

        {/* ADD TRANSACTION FORM - requires edit permission */}
        <RequirePermission permission="edit_finances">
          <AddTransactionForm onSuccess={loadData} />
        </RequirePermission>

        {/* MEMBER GIVING */}
        <div className="card">
          <h3>Member Giving Summary</h3>
          {members.length === 0 ? (
            <p>No contributions yet.</p>
          ) : (
            <>
              <table className="member-list-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Total Given</th>
                    <th>Last Given</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.member_id}>
                      <td>{m.full_name}</td>
                      <td>KES {m.total_given?.toLocaleString()}</td>
                      <td>{m.last_given}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={downloadMembersPDF}>Download PDF</button>
            </>
          )}
        </div>
      </div>
    </RequirePermission>
  );
}
