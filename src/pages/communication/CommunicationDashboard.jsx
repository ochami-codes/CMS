// src/pages/communication/CommunicationDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/ToastProvider";
import { AnnouncementsAPI } from "../../utils/api";
import RequirePermission from "../../components/RequirePermission";
import Input from "../../components/Input";
import Button from "../../components/Button";


export default function CommunicationDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- Fetch announcements ---------------- */
  const loadAnnouncements = async () => {
    if (!user?.church_id) return;

    try {
      setLoading(true);
      const data = await AnnouncementsAPI.fetch(user.church_id, 20);
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load announcements", "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [user?.church_id]);

  /* ---------------- Add announcement ---------------- */
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      showToast("Title and message are required", "error");
      return;
    }

    try {
      setSubmitting(true);

      await AnnouncementsAPI.create({
        title,
        message,
        churchId: user.church_id,
      });

      showToast("Announcement added", "success");

      setTitle("");
      setMessage("");
      loadAnnouncements();

    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to add announcement", "error");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- Delete announcement ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;

    try {
      await AnnouncementsAPI.remove(id);

      showToast("Announcement deleted", "success");

      setAnnouncements((prev) =>
        prev.filter((a) => a.id !== id)
      );

    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to delete announcement", "error");
    }
  };

  if (loading)
    return (
      <main className="page-container">
        <p>Loading…</p>
      </main>
    );

  return (
    <RequirePermission permission="access_media_dashboard">
      <main className="page-container space-y-6">

        {/* Page Header */}
        <header className="page-header">
          <h1 className="page-title">Communication Dashboard</h1>
          <p className="text-muted">Manage church announcements.</p>
        </header>

        {/* Add Announcement */}
        <section className="page-card">
          <h2 className="card-title">Add Announcement</h2>

          <form onSubmit={handleAdd} className="form-stack">
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
        </section>

        {/* Recent Announcements */}
        <section className="page-card">
          <h2 className="card-title">Recent Announcements</h2>

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

                    <small className="text-muted">
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
        </section>

      </main>
    </RequirePermission>
  );
}
