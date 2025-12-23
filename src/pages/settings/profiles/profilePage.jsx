import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../supabaseClient";
import profileForm from "./profileForm";
import contributions from "./contributions";
import summaryChart from "./summaryChart";

const profilePage = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [contributions, setContributions] = useState({
    tithes: 0,
    offerings: 0,
    campOfferings: 0,
    churchDevelopment: 0,
  });

  // Load existing profile data from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user?.id)
        .single();
      if (data) {
        setFullName(data.full_name);
        setPhone(data.phone);
      }
    };
    if (user) loadProfile();
  }, [user]);

  // Load contributions data
  useEffect(() => {
    const loadContributions = async () => {
      const { data } = await supabase
        .from("contributions")
        .select("type, amount")
        .eq("user_id", user?.id);
      if (data) {
        const contributionsData = {
          tithes: 0,
          offerings: 0,
          campOfferings: 0,
          churchDevelopment: 0,
        };
        data.forEach((contribution) => {
          switch (contribution.type) {
            case "tithes":
              contributionsData.tithes += contribution.amount;
              break;
            case "offerings":
              contributionsData.offerings += contribution.amount;
              break;
            case "campOfferings":
              contributionsData.campOfferings += contribution.amount;
              break;
            case "churchDevelopment":
              contributionsData.churchDevelopment += contribution.amount;
              break;
            default:
              break;
          }
        });
        setContributions(contributionsData);
      }
    };
    if (user) loadContributions();
  }, [user]);

  const handleUpdate = async (fullName, phone, email) => {
    setLoading(true);
    setMessage("");
    try {
      // Update profile table (custom)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
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
      <p style={{ color:"#666"}}>                              
        Manage your account information.
      </p>
      <ProfileForm
        fullName={fullName}
        phone={phone}
        email={email}
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

export default profilePage;
