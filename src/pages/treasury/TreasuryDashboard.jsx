‎import { useEffect, useState } from "react";
‎import { TreasuryAPI } from "../../utils/API";
‎import { useAuth } from "../../context/AuthContext";
‎
‎import FundGroupChart from "../../components/treasury/FundGroupChart";
‎import FundBreakdownChart from "../../components/treasury/FundBreakdownChart";
‎import AddTransactionForm from "../../components/treasury/AddTransactionForm";
‎import DateFilter from "../../components/treasury/DateFilter";
‎import { generateTablePDF } from "../../utils/pdf";
‎
‎export default function TreasuryDashboard() {
‎  const { user } = useAuth();
‎
‎  const [overview, setOverview] = useState(null);
‎  const [groups, setGroups] = useState([]);
‎  const [funds, setFunds] = useState([]);
‎  const [members, setMembers] = useState([]);
‎  const [selectedGroup, setSelectedGroup] = useState("");
‎  const [filter, setFilter] = useState({ start: "", end: "" });
‎
‎  const params =
‎    filter.start || filter.end
‎      ? `?start=${filter.start}&end=${filter.end}`
‎      : "";
‎
‎  const loadData = async () => {
‎    setOverview(await TreasuryAPI.overview(params));
‎    setGroups(await TreasuryAPI.fundGroups(params));
‎    setMembers(await TreasuryAPI.memberGivingSummary(params));
‎  };
‎
‎  useEffect(() => {
‎    loadData();
‎  }, [params]);
‎
‎  useEffect(() => {
‎    if (selectedGroup) {
‎      TreasuryAPI.fundsByGroup(selectedGroup, params).then(setFunds);
‎    }
‎  }, [selectedGroup, params]);
‎
‎  const downloadMembersPDF = () => {
‎    generateTablePDF(
‎      "Member Giving Summary",
‎      ["Member", "Total Given", "Last Given"],
‎      members.map((m) => [
‎        m.full_name,
‎        m.total_given,
‎        m.last_given,
‎      ])
‎    );
‎  };
‎
‎  return (
‎    <div className="dashboard-layout">
‎      <h1 className="page-title">Treasury Dashboard</h1>
‎      <p className="page-subtext">
‎        Financial overview based on church funds and transactions
‎      </p>
‎
‎      {/* DATE FILTER */}
‎      <DateFilter onChange={setFilter} />
‎
‎      {/* SNAPSHOT */}
‎      {overview && (
‎        <div className="stats-grid">
‎          <div className="stat-card">
‎            <h3>Total Income</h3>
‎            <p>KES {overview.total_income}</p>
‎          </div>
‎          <div className="stat-card">
‎            <h3>Total Expenses</h3>
‎            <p>KES {overview.total_expenses}</p>
‎          </div>
‎          <div className="stat-card">
‎            <h3>Balance</h3>
‎            <p>KES {overview.balance}</p>
‎          </div>
‎          <div className="stat-card">
‎            <h3>Active Funds</h3>
‎            <p>{overview.active_funds}</p>
‎          </div>
‎        </div>
‎      )}
‎
‎      {/* FUND GROUP OVERVIEW */}
‎      <div className="card">
‎        <h3>Fund Group Overview</h3>
‎        <FundGroupChart data={groups} />
‎      </div>
‎
‎      {/* FUND BREAKDOWN */}
‎      <div className="card">
‎        <h3>Fund Breakdown</h3>
‎
‎        <select
‎          value={selectedGroup}
‎          onChange={(e) => setSelectedGroup(e.target.value)}
‎        >
‎          <option value="">Select Fund Group</option>
‎          {groups.map((g) => (
‎            <option key={g.group_id} value={g.group_id}>
‎              {g.group_name}
‎            </option>
‎          ))}
‎        </select>
‎
‎        {funds.length > 0 && (
‎          <FundBreakdownChart data={funds} />
‎        )}
‎      </div>
‎
‎      {/* ADD TRANSACTION */}
‎      {["Admin", "Treasurer"].includes(user.role) && (
‎        <AddTransactionForm onSuccess={loadData} />
‎      )}
‎
‎      {/* MEMBER GIVING */}
‎      <div className="card">
‎        <h3>Member Giving Summary</h3>
‎
‎        <table className="member-list-table">
‎          <thead>
‎            <tr>
‎              <th>Member</th>
‎              <th>Total Given</th>
‎              <th>Last Given</th>
‎            </tr>
‎          </thead>
‎          <tbody>
‎            {members.map((m) => (
‎              <tr key={m.member_id}>
‎                <td>{m.full_name}</td>
‎                <td>KES {m.total_given}</td>
‎                <td>{m.last_given}</td>
‎              </tr>
‎            ))}
‎          </tbody>
‎        </table>
‎
‎        <button onClick={downloadMembersPDF}>
‎          Download PDF
‎        </button>
‎      </div>
‎    </div>
‎  );
‎}
‎
