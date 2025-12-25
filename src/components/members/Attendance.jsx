import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { memberFields } from "../../utils/memberFields";

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
      const { data: membersData, error: membersError } = await supabase.from(table).select("*").order("name", { ascending: true });
      if (membersError) { console.error(membersError.message); setMembers([]); setLoading(false); return; }
      setMembers(membersData ?? []);

      // Fetch today's attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("department", department)
        .eq("date", today);

      if (attendanceError) console.error(attendanceError.message);
      const map = {};
      attendanceData?.forEach(r => map[r.member_id] = r.present);
      setAttendance(map);
      setLoading(false);
    };

    fetchData();
  }, [table, department, today]);

  const toggleAttendance = id => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));

  const saveAttendance = async () => {
    if (!members.length) return;
    setSaving(true);

    const records = members.map(m => ({
      member_id: m.id,
      department,
      date: today,
      present: attendance[m.id] ?? false,
    }));

    const { error } = await supabase.from("attendance").upsert(records, { onConflict: ["member_id", "department", "date"] });
    setSaving(false);
    if (error) alert("Error: " + error.message);
    else alert("Attendance saved successfully!");
  };

  if (!table) return <p>No configuration for "{department}"</p>;
  if (loading) return <p>Loading attendance...</p>;

  return (
    <div>
      <h2>{department.toUpperCase()} Attendance</h2>
      <table style={{ width: "100%", marginTop: 8, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Present</th>
          </tr>
        </thead>
        <tbody>
          {members.length ? members.map(m => (
            <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>{m.name}</td>
              <td style={{ padding: 8, textAlign: "center" }}>
                <input type="checkbox" checked={attendance[m.id] ?? false} onChange={() => toggleAttendance(m.id)} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={2} style={{ textAlign: "center", padding: 8 }}>No members found</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        onClick={saveAttendance}
        disabled={saving}
        style={{ marginTop: 12, padding: "8px 16px", background: "#0077b6", color: "#fff", border: "none", borderRadius: 6 }}
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}