import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";
import toast from "react-hot-toast";
import "../../styles/global.css";

export default function Attendance({ department }) {
  const config = memberFields[department];
  const table = config?.table;

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    if (!table) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from(table)
        .select("*")
        .order("name", { ascending: true });
      if (membersError) {
        console.error(membersError.message);
        setMembers([]);
        setLoading(false);
        return;
      }
      setMembers(membersData ?? []);

      // Fetch today's attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("department", department)
        .eq("date", today);

      if (attendanceError) console.error(attendanceError.message);

      const map = {};
      attendanceData?.forEach(r => (map[r.member_id] = r.present));
      setAttendance(map);
      setLoading(false);
    };

    fetchData();
  }, [table, department, today]);

  const toggleAttendance = id =>
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));

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

    const { error } = await supabase
      .from("attendance")
      .upsert(records, { onConflict: ["member_id", "department", "date"] });

    setSaving(false);
    if (error)
      toast.error("Error saving attendance: " + error.message, { id: toastId });
    else toast.success("Attendance saved successfully!", { id: toastId });
  };

  if (!table) return <p>No configuration for "{department}"</p>;
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