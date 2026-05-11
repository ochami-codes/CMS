// components/dashboard/SabbathSection.jsx

import { Calendar } from "lucide-react";

export default function SabbathSection({
  isSabbath,
  sabbathTimer,
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <Calendar size={18} />
        Sabbath
      </div>

      <div className="card">

        {isSabbath ? (
          <p>Sabbath ongoing</p>
        ) : sabbathTimer ? (
          <p>
            Starts in{" "}
            {sabbathTimer.d}d{" "}
            {sabbathTimer.h}h{" "}
            {sabbathTimer.m}m{" "}
            {sabbathTimer.s}s
          </p>
        ) : (
          <p>Preparing Sabbath timer...</p>
        )}

      </div>
    </section>
  );
}
