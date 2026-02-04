// src/components/members/Attendance.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MembersAPI, AttendanceAPI } from "../../utils/api";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (!department) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const membersData = await MembersAPI.fetchAll(department);
        setMembers(membersData?.members ?? []);

        const attendanceRecords = await AttendanceAPI.fetch(department, today);
        const map = {};
        attendanceRecords?.forEach(r => (map[r.member_id] = r.present));
        setAttendance(map);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        toast.error(err.message || "Error fetching attendance");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, today]);

  // ---------------- TOGGLE ----------------
  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------------- SAVE ----------------
  const saveAttendance = async () => {
    if (!members.length) return;

    setSaving(true);
    const toastId = toast.loading("Saving attendance...");

    const records = members.map(m => ({
      member_id: m.id,
      department,
      date: today,
      present: attendance[m.id] ?? false,
    }));

    try {
      await AttendanceAPI.save(records);
      toast.success("Attendance saved successfully!", { id: toastId });
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
    <div className="dashboard-content">
      <div className="card">
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          {department.toUpperCase()} Attendance
        </h2>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Present</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No members found</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={saveAttendance}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}
