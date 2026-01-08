import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";
import "../../styles/global.css";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const apiUrl = API_BASE_URL;

  // ------------------ FETCH DATA ------------------
  useEffect(() => {
    if (!department) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch members for the department
        const membersRes = await fetch(
          `${apiUrl}/members?department=${department}`,
          { credentials: "include" }
        );
        const membersData = await membersRes.json();
        if (!membersRes.ok) throw new Error(membersData.message || "Failed to fetch members");
        setMembers(membersData.members ?? []);

        // 2️⃣ Fetch today's attendance
        const attendanceRes = await fetch(
          `${apiUrl}/attendance?department=${department}&date=${today}`,
          { credentials: "include" }
        );
        const attendanceData = await attendanceRes.json();
        if (!attendanceRes.ok) throw new Error(attendanceData.message || "Failed to fetch attendance");

        const map = {};
        attendanceData.records?.forEach(r => (map[r.member_id] = r.present));
        setAttendance(map);
      } catch (err) {
        console.error(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, today]);

  // ------------------ TOGGLE ATTENDANCE ------------------
  const toggleAttendance = (id) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));

  // ------------------ SAVE ATTENDANCE ------------------
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
      const res = await fetch(`${apiUrl}/attendance`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save attendance");

      toast.success("Attendance saved successfully!", { id: toastId });
    } catch (err) {
      toast.error("Error saving attendance: " + err.message, { id: toastId });
      console.error("SaveAttendance error:", err.message);
    } finally {
      setSaving(false);
    }
  };

  // ------------------ RENDER ------------------
  if (!department) return <p>No configuration for "{department}"</p>;
  if (loading) return <p>Loading attendance...</p>;

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">{department.toUpperCase()} Attendance</h2>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {members.length ? (
            members.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
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

      <button
        onClick={saveAttendance}
        disabled={saving}
        className="attendance-save-btn"
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}