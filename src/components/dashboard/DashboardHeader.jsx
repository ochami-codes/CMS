// components/dashboard/DashboardHeader.jsx

import { Home } from "lucide-react";

export default function DashboardHeader({
  churchName,
  greeting,
  verse,
}) {
  return (
    <section className="dashboard-section">
      <div className="card">
        <h2>
          <Home size={18} /> {churchName}
        </h2>

        <p>{greeting}</p>

        {verse && (
          <p>
            <strong>{verse.reference}</strong>:{" "}
            {verse.text}
          </p>
        )}
      </div>
    </section>
  );
}
