// src/components/members/Attendance.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MembersAPI, AttendanceAPI } from "../../utils/api"; // centralized APIs
import "../../styles/global.css";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // ------------------ FETCH DATA ------------------
  useEffect(() => {
    if (!department) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch members
        const membersData = await MembersAPI.fetchAll(department);
        setMembers(membersData?.members ?? []);

        // Fetch today's attendance
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

  // ------------------ TOGGLE ATTENDANCE ------------------
  const toggleAttendance = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
      await AttendanceAPI.save(records);
      toast.success("Attendance saved successfully!", { id: toastId });
    } catch (err) {
      console.error("SaveAttendance error:", err);
      toast.error("Error saving attendance: " + err.message, { id: toastId });
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
