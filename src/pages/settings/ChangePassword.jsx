import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { isStrongPassword } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function ChangePassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState(""); // optional, for UX only
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError("Password must be at least 6 characters and include a number and a letter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update password.");
      } else {
        setSuccess("Password updated successfully. For security, please sign in again.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Change Password</h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Change your account password. After a successful change you may need to sign in again.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Current password (optional)"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />

        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 6 characters, include a number"
          required
        />

        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          required
        />

        {error && <p className="error" style={{ marginBottom: 12 }}>{error}</p>}
        {success && <p className="success" style={{ marginBottom: 12 }}>{success}</p>}

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>

          <Button type="button" onClick={() => navigate("/dashboard/profile")}>
            Cancel
          </Button>
        </div>
      </form>

      {success && (
        <div style={{ marginTop: 16 }}>
          <p style={{ marginBottom: 8 }}>For security we recommend signing out and signing back in.</p>
          <div style={{ display: "flex", gap: 8 }}>
            <Button onClick={handleSignOut}>Sign out & sign in</Button>
            <Button onClick={() => navigate("/dashboard/profile")}>Back to profile</Button>
          </div>
        </div>
      )}
    </div>
  );
}