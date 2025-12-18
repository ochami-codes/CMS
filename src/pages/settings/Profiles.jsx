import { useState, useEffect } from "react";
import {useAuth} from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing profile data from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id)
        .single();

      if (data) setFullName(data.full_name);
    };

    if (user) loadProfile();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Update profile table (custom)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update email in auth
      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) throw authError;

      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Your Profile</h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Manage your account information.
      </p>

      <form onSubmit={handleUpdate}>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          required
        />

        {message && (
          <p
            style={{
              marginBottom: "1rem",
              color: message.includes("successfully") ? "green" : "red",
            }}
          >
            {message}
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <Button
        onClick={() => navigate("/dashboard/settings/change-password")}
        style={{ background: "#555" }}
      >
        Change Password
      </Button>
    </div>
  );
}
