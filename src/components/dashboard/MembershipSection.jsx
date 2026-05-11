// components/dashboard/MembershipSection.jsx

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { MembershipAPI } from "../../utils/api";

export default function MembershipSection({
  membership,
}) {
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleRequestMembership = async () => {
    try {
      setLoading(true);

      setSuccessMessage("");
      setErrorMessage("");

      await MembershipAPI.submit({});

      setSuccessMessage(
        "Membership request submitted 🙏"
      );

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Request failed";

      setErrorMessage(message);

    } finally {
      setLoading(false);
    }
  };

  const status = membership?.status;

  const hasActiveRequest =
    membership?.hasActiveRequest;

  return (
    <section className="dashboard-section">
      <div className="dashboard-section-header">
        <UserPlus size={18} />
        Join Your Church
      </div>

      <div className="card">

        {/* STATUS MESSAGE */}

        <p>
          {status === "requested"
            ? "Your membership request is pending review."

            : status === "accepted"
            ? "Your membership has been approved 🎉"

            : status === "rejected"
            ? "Your membership request was rejected."

            : "Request membership to access ministries and announcements."}
        </p>

        {/* REQUEST BUTTON */}

        {!hasActiveRequest && (
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleRequestMembership}
          >
            {loading
              ? "Sending request..."
              : "Request Membership"}
          </button>
        )}

        {/* SUCCESS */}

        {successMessage && (
          <div
            className="message-success"
            style={{ marginTop: "0.5rem" }}
          >
            {successMessage}
          </div>
        )}

        {/* ERROR */}

        {errorMessage && (
          <div
            className="message-error"
            style={{ marginTop: "0.5rem" }}
          >
            {errorMessage}
          </div>
        )}

      </div>
    </section>
  );
}
