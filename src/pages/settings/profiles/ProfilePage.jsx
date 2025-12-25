import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabaseClient";
import ProfileForm from "./ProfileForm";
import Contributions from "./Contributions";
import SummaryChart from "./SummaryChart";

const ProfilePage = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contributions, setContributions] = useState({
    tithes: 0,
    offerings: 0,
    campOfferings: 0,
    churchDevelopment: 0,
  });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          setProfile({
            fullName: profileData.full_name,
            phone: profileData.phone,
            email: user.email,
          });
        }

        // Load contributions
        const { data: contributionsData, error: contributionsError } = await supabase
          .from("contributions")
          .select("type, amount")
          .eq("user_id", user.id);

        if (contributionsError) throw contributionsError;

        if (contributionsData) {
          const formatted = {
            tithes: 0,
            offerings: 0,
            campOfferings: 0,
            churchDevelopment: 0,
          };
          contributionsData.forEach((c) => {
            if (formatted[c.type] !== undefined) formatted[c.type] += c.amount;
          });
          setContributions(formatted);
        }
      } catch (err) {
        console.error(err);
        setMessage(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleUpdate = async (updatedProfile) => {
    setLoading(true);
    setMessage("");
    try {
      // Update profile table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: updatedProfile.fullName,
          phone: updatedProfile.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update email in auth
      const { error: authError } = await supabase.auth.updateUser({
        email: updatedProfile.email,
      });

      if (authError) throw authError;

      setProfile(updatedProfile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2>Your Profile</h2>
      <p style={{ color: "#666" }}>Manage your account information.</p>

      <ProfileForm
        profile={profile}
        onUpdate={handleUpdate}
        loading={loading}
        message={message}
      />

      <hr style={{ margin: "2rem 0" }} />

      <h3>Contributions</h3>
      <Contributions contributions={contributions} />

      <h3>Summary</h3>
      <SummaryChart contributions={contributions} />
    </div>
  );
};

export default ProfilePage;