// components/dashboard/ToolsSection.jsx

import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function ToolsSection({
  canUser,
}) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <Users size={18} />
        Tools
      </div>

      <div className="dashboard-actions">

        {/* Treasury */}

        {canUser(
          "access_treasury_dashboard"
        ) && (
          <Link
            to="/dashboard/treasury"
            className="dashboard-action-card"
          >
            Treasury
          </Link>
        )}

        {/* Youth */}

        {canUser(
          "access_youth_dashboard"
        ) && (
          <Link
            to="/dashboard/youth"
            className="dashboard-action-card"
          >
            Youth
          </Link>
        )}

        {/* Admin */}

        {canUser(
          "access_admin_dashboard"
        ) && (
          <Link
            to="/dashboard/admin"
            className="dashboard-action-card"
          >
            Admin
          </Link>
        )}

      </div>
    </section>
  );
}
