// src/components/members/Attendance.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MembersAPI, AttendanceAPI } from "../../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceType, setServiceType] = useState("Morning");

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  // ---------------- FETCH MEMBERS & ATTENDANCE ----------------
  useEffect(() => {
    if (!department) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const membersData = await MembersAPI.fetchAll(department);
        setMembers(membersData?.members ?? []);

        const attendanceRecords = await AttendanceAPI.fetch(department, today);
        const map = {};
        const notesMap = {};
        attendanceRecords?.records?.forEach((r) => {
          map[r.member_id] = r.present;
          notesMap[r.member_id] = r.notes || "";
        });
        setAttendance(map);
        setNotes(notesMap);

        await fetchSummary("month");
        await fetchSummary("year");
      } catch (err) {
        console.error("Attendance fetch error:", err);
        toast.error(err.message || "Error fetching attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, today]);

  // ---------------- FETCH SUMMARY ----------------
  const fetchSummary = async (period = "month") => {
    try {
      const res = await AttendanceAPI.summary(department, period);
      if (period === "month") setMonthlyData(res?.summary ?? []);
      if (period === "year") setYearlyData(res?.summary ?? []);
    } catch (err) {
      console.error(`Fetch ${period} summary error:`, err);
    }
  };

  // ---------------- TOGGLE ATTENDANCE ----------------
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------------- SAVE ----------------
  const saveAttendance = async () => {
    if (!members.length) return;
    setSaving(true);
    const toastId = toast.loading("Saving attendance...");

    const records = members.map((m) => ({
      member_id: m.id,
      department,
      date: today,
      present: attendance[m.id] ?? false,
      notes: notes[m.id] ?? "",
      service_type,
    }));

    try {
      await AttendanceAPI.save(records);
      toast.success("Attendance saved successfully!", { id: toastId });
      await fetchSummary("month");
      await fetchSummary("year");
    } catch (err) {
      console.error("Save attendance error:", err);
      toast.error(err.message || "Error saving attendance", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // ---------------- RENDER ----------------
  if (!department) {
    return (
      <div className="dashboard-content">
        <div className="card">No department selected.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="card">Loading attendance…</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content space-y-4">
      {/* Attendance Table */}
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold">{department.toUpperCase()} Attendance</h2>

        <div className="form-group">
          <label>Service Type:</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Present</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((m) => (
                <tr key={m.id}>
                  <td>{m.full_name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={attendance[m.id] ?? false}
                      onChange={() => toggleAttendance(m.id)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={notes[m.id] ?? ""}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [m.id]: e.target.value }))
                      }
                      placeholder="Notes"
                      className="border px-2 py-1 rounded w-full"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-2">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          onClick={saveAttendance}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </div>

      {/* Monthly Chart */}
      <div className="card">
        <h3 className="text-md font-semibold mb-2">Monthly Attendance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentCount" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Chart */}
      <div className="card">
        <h3 className="text-md font-semibold mb-2">Yearly Attendance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yearlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentCount" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
