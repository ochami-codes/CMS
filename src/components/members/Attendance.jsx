// src/components/members/Attendance.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import toast from "react-hot-toast";
import "../../styles/pages.css";
import { MembersAPI, AttendanceAPI } from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceType, setServiceType] = useState("Morning");

  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = useCallback(async () => {
    if (!department) return;
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
      console.error(err);
      toast.error(err.message || "Error fetching attendance");
    } finally {
      setLoading(false);
    }
  }, [department, today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ---------------- SUMMARY ---------------- */
  const fetchSummary = async (period) => {
    try {
      const res = await AttendanceAPI.summary(department, period);
      if (period === "month") setMonthlyData(res?.summary ?? []);
      if (period === "year") setYearlyData(res?.summary ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const toggleAttendance = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      service_type: serviceType,
    }));

    try {
      await AttendanceAPI.save(records);
      toast.success("Attendance saved successfully", { id: toastId });
      await fetchSummary("month");
      await fetchSummary("year");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error saving attendance", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- STATES ---------------- */
  if (!department) {
    return (
      <>
        <h2 className="card-title">Attendance</h2>
        <p className="card-subtitle">No department selected.</p>
      </>
    );
  }

  if (loading) {
    return <p>Loading attendance…</p>;
  }

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* Attendance Form */}
      <div className="card">
        <h2 className="card-title">
          {department} Attendance
        </h2>

        <p className="card-subtitle">
          Mark attendance for today’s service.
        </p>

        <div className="form-group">
          <label className="label">Service Type</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="input-field"
          >
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>

        <table className="member-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Present</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {members.length ? (
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
                        setNotes((p) => ({
                          ...p,
                          [m.id]: e.target.value,
                        }))
                      }
                      placeholder="Notes"
                      className="input-field"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="table-empty">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Saving…" : "Save Attendance"}
          </button>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="card">
        <h3 className="card-title-sm">Monthly Attendance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentCount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yearly Chart */}
      <div className="card">
        <h3 className="card-title-sm">Yearly Attendance</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={yearlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentCount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
