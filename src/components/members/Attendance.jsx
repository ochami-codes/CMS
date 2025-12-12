import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export default function Attendance({ department }) {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({}); // { memberId: true/false }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // Fetch members and today's attendance
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1️⃣ Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*")
        .eq("department", department)
        .order("name", { ascending: true });

      if (membersError) {
        console.error("Error fetching members:", membersError.message);
        setLoading(false);
        return;
      }

      setMembers(membersData || []);

      // 2️⃣ Fetch today's attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("department", department)
        .eq("date", today);

      if (attendanceError) console.error(attendanceError.message);

      const attendanceMap = {};
      attendanceData?.forEach((record) => {
        attendanceMap[record.member_id] = record.present;
      });

      setAttendance(attendanceMap);
      setLoading(false);
    };

    fetchData();
  }, [department, today]);

  const toggleAttendance = (memberId) => {
    setAttendance((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const saveAttendance = async () => {
    setSaving(true);

    const records = members.map((m) => ({
      member_id: m.id,
      department,
      date: today,
      present: attendance[m.id] || false,
    }));

    const { error } = await supabase.from("attendance").upsert(records, {
      onConflict: ["member_id", "date"],
    });

    setSaving(false);
    if (!error) {
      alert("Attendance saved successfully!");
    } else {
      alert("Error saving attendance: " + error.message);
    }
  };

  if (loading) return <p>Loading attendance...</p>;

  return (
    <div>
      <h2>{department.toUpperCase()} Attendance</h2>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Present</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px" }}>{m.name}</td>
              <td style={{ padding: "8px", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={attendance[m.id] || false}
                  onChange={() => toggleAttendance(m.id)}
                />
              </td>
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan="2" style={{ padding: "8px", textAlign: "center" }}>
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={saveAttendance}
        disabled={saving}
        style={{
          marginTop: "15px",
          padding: "8px 16px",
          background: "#0077b6",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}
