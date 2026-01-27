import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AnnouncementsAPI } from "../../utils/api";
import RequirePermission from "../../components/RequirePermission";
import Input from "../../components/Input";
import Button from "../../components/Button";
import toast from "react-hot-toast";

export default function CommunicationDashboard() {
  const { profile } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- Fetch announcements ---------------- */
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await AnnouncementsAPI.fetch(profile.church_id, 20);
      setAnnouncements(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.church_id) loadAnnouncements();
  }, [profile?.church_id]);

  /* ---------------- Add announcement ---------------- */
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    try {
      setSubmitting(true);

      await AnnouncementsAPI.create({
        title,
        message,
        churchId: profile.church_id,
      });

      toast.success("Announcement added");
      setTitle("");
      setMessage("");
      loadAnnouncements();
    } catch (err) {
      toast.error(err.message || "Failed to add announcement");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Delete announcement ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      await AnnouncementsAPI.remove(id);
      toast.success("Announcement deleted");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete announcement");
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <RequirePermission permission="manage_announcements">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Communication Dashboard</h1>

        {/* Add announcement */}
        <div className="card">
          <h3 className="font-semibold mb-2">Add Announcement</h3>
          <form onSubmit={handleAdd} className="space-y-2">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Message"
              textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Add"}
            </Button>
          </form>
        </div>

        {/* List announcements */}
        <div className="card">
          <h3 className="font-semibold mb-2">Recent Announcements</h3>

          {announcements.length === 0 ? (
            <p>No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between items-start border-b pb-2"
                >
                  <div>
                    <strong>{a.title}</strong>
                    <p>{a.message}</p>
                    <small className="text-gray-500">
                      {new Date(a.created_at).toLocaleString()}
                    </small>
                  </div>
                  <Button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(a.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </RequirePermission>
  );
}
