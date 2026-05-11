// components/dashboard/AnnouncementsSection.jsx

import { Megaphone } from "lucide-react";

export default function AnnouncementsSection({
  announcements,
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <Megaphone size={18} />
        Announcements
      </div>

      <div className="card">

        {announcements.length ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="announcement-card"
            >
              <h4>
                {announcement.title}
              </h4>

              <p>
                {announcement.message}
              </p>
            </div>
          ))
        ) : (
          <p>No announcements</p>
        )}

      </div>
    </section>
  );
}
