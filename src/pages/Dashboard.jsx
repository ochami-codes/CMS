import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import "../styles/pages.css";

import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
  AnnouncementsAPI,
  ChurchAPI,
  MembershipAPI,
} from "../utils/api";

import { hasRole, isAdmin } from "../utils/permissions";
import {
  Home,
  Coffee,
  Users,
  UserPlus,
  Calendar,
  Gift,
  Megaphone,
} from "lucide-react";

/* ================= HELPERS ================= */

const isSabbathNow = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return (day === 5 && hour >= 18) || (day === 6 && hour < 18);
};

const nextSabbathStart = () => {
  const now = new Date();
  const start = new Date(now);
  const day = now.getDay();
  const hour = now.getHours();

  if (day < 5) start.setDate(now.getDate() + (5 - day));
  else if (!(day === 5 && hour < 18)) start.setDate(now.getDate() + (12 - day));

  start.setHours(18, 0, 0, 0);
  return start;
};

const timeDiff = (target) => {
  const diff = target - new Date();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor(diff / (1000 * 60 * 60)) % 24,
    m: Math.floor(diff / (1000 * 60)) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
};

/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  if (authLoading || loading) return <Loader />;
  const [verse, setVerse] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [churchName, setChurchName] = useState("Your Church");

  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loadingMembershipRequest, setLoadingMembershipRequest] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [membershipError, setMembershipError] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [sabbathTimer, setSabbathTimer] = useState(null);

  const isMember = user?.is_member === true;
  const isGuest = user?.role_name === "Guest";
  const churchId = user?.church_id;

  /* ================= GREETING ================= */

  const greeting = useMemo(() => {
    const name = user?.full_name || "Child of God";
    const hour = new Date().getHours();
    if (isSabbathNow()) return `Happy Sabbath, ${name}!`;
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  }, [user]);

  /* ================= SABBATH TIMER ================= */

  useEffect(() => {
    const timer = setInterval(() => {
      setSabbathTimer(
        isSabbathNow() ? null : timeDiff(nextSabbathStart())
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= DATA FETCH ================= */

  useEffect(() => {
    if (!user) return;
    let alive = true;

    const fetchDashboard = async () => {
      try {
        const [
          dailyVerse,
          church,
          myBirthdayData,
          todays,
          upcoming,
          anns,
          membership,
        ] = await Promise.all([
          getDailyVerse(),
          churchId ? ChurchAPI.getById(churchId) : null,
          !isGuest ? getMyBirthday() : null,
          !isGuest ? getTodaysBirthdays(churchId) : [],
          !isGuest ? getUpcomingBirthdays(churchId, 30) : [],
          !isGuest ? AnnouncementsAPI.fetch(churchId, 5) : [],
          isGuest ? MembershipAPI.myRequests() : null,
        ]);

        if (!alive) return;

        setVerse(dailyVerse);
        setChurchName(church?.name || user.church_name || "Your Church");
        setTodayBirthdays(todays || []);
        setUpcomingBirthdays(upcoming || []);
        setAnnouncements(anns || []);

        if (isGuest) {
          setMembershipStatus(
            membership?.request?.membership_request_status || null
          );
          setBirthday(null);
          return;
        }

        if (myBirthdayData?.birthday?.date) {
          const dob = new Date(myBirthdayData.birthday.date);
          if (!isNaN(dob)) {
            const today = new Date();
            let nextBirthday = new Date(
              today.getFullYear(),
              dob.getMonth(),
              dob.getDate()
            );
            if (nextBirthday < today)
              nextBirthday.setFullYear(today.getFullYear() + 1);

            setBirthday({
              birthday: myBirthdayData.birthday.date,
              isBirthday: myBirthdayData.isBirthday,
              daysLeft: Math.ceil(
                (nextBirthday - today) / (1000 * 60 * 60 * 24)
              ),
            });
          }
        } else setBirthday(null);
      } finally {
        alive && setLoading(false);
      }
    };

    fetchDashboard();
    return () => (alive = false);
  }, [user, churchId, isGuest]);

 
  /* ================= UI ================= */

  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <section className="dashboard-section">
        <div className="card">
          <h2 className="card-title">
            <Home size={18} /> {churchName}
          </h2>
          <p className="card-subtitle">{greeting}</p>
          {verse && (
            <p className="dashboard-verse">
              <strong>{verse.reference}:</strong> {verse.text}
            </p>
          )}
        </div>
      </section>

      {/* MEMBERSHIP REQUEST SECTION */}
{isGuest && (
  <section className="dashboard-section">
    <div className="dashboard-section-header">
      <UserPlus size={18} /> Join Your Church
    </div>

    <div className="card">
      {/* MESSAGE LOGIC */}
      <p>
        {membershipStatus?.source === "user_request" &&
        membershipStatus?.status === "requested"
          ? "Your membership request is pending review."
          : membershipStatus?.source === "user_request" &&
            membershipStatus?.status === "approved"
          ? "Your membership has been approved 🎉"
          : membershipStatus?.source === "user_request" &&
            membershipStatus?.status === "rejected"
          ? "Your membership request was rejected."
          : membershipStatus?.source === "admin_invite" &&
            membershipStatus?.status === "invited"
          ? "You have been invited to join this church."
          : "Request membership to access ministries and announcements."}
      </p>

      {/* USER REQUEST BUTTON */}
      {!membershipStatus && (
        <button
          className="btn btn-primary"
          disabled={loadingMembershipRequest}
          onClick={async () => {
            try {
              setLoadingMembershipRequest(true);
              setMembershipError("");
              setSuccessMessage("");

              await MembershipAPI.submit({});
              setMembershipStatus({
                status: "requested",
                source: "user_request",
              });

              setSuccessMessage("Membership request submitted 🙏");
            } catch (e) {
              const message =
                e.response?.data?.message || "Request failed";
              setMembershipError(message);
            } finally {
              setLoadingMembershipRequest(false);
            }
          }}
        >
          {loadingMembershipRequest
            ? "Sending request..."
            : "Request Membership"}
        </button>
      )}

      {/* SUCCESS / ERROR */}
      {successMessage && (
        <div className="message-success" style={{ marginTop: "0.5rem" }}>
          {successMessage}
        </div>
      )}

      {membershipError && (
        <div className="message-error" style={{ marginTop: "0.5rem" }}>
          {membershipError}
        </div>
      )}
    </div>
  </section>
)}
      {/* REST OF DASHBOARD UNCHANGED */}
      {!isGuest && (
        <>
          {/* QUICK LINKS */}
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <Coffee size={18} /> Quick Links
            </div>
            <div className="dashboard-actions">
              {hasRole(user.role_name, ["Treasurer", "Admin", "Pastor"]) && (
                <Link
                  to="/dashboard/treasury"
                  className="dashboard-action-card"
                >
                  <h3>
                    <Coffee size={18} /> Treasury
                  </h3>
                  <p>Church finances</p>
                </Link>
              )}

              {hasRole(user.role_name, [
                "Youth_leader",
                "Admin",
                "Pastor",
              ]) && (
                <Link
                  to="/dashboard/youth"
                  className="dashboard-action-card"
                >
                  <h3>
                    <Users size={18} /> Youth Ministry
                  </h3>
                  <p>Activities & attendance</p>
                </Link>
              )}

              {isAdmin(user.role_name) && (
                <Link
                  to="/dashboard/admin"
                  className="dashboard-action-card"
                >
                  <h3>
                    <UserPlus size={18} /> Administration
                  </h3>
                  <p>Members & roles</p>
                </Link>
              )}
            </div>
          </section>

          {/* ANNOUNCEMENTS */}
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <Megaphone size={18} /> Announcements
            </div>
            <div className="card">
              {announcements.length ? (
                announcements.map((a) => (
                  <div key={a.id} className="announcement-card">
                    <h4>{a.title}</h4>
                    <p>{a.message}</p>
                  </div>
                ))
              ) : (
                <p>No announcements yet.</p>
              )}
            </div>
          </section>

          {/* SABBATH TRACKER */}
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <Calendar size={18} /> Sabbath Tracker
            </div>
            <div className="card sabbath-card">
              {sabbathTimer ? (
                <p>
                  Sabbath begins in{" "}
                  <strong>
                    {sabbathTimer.d}d {sabbathTimer.h}h{" "}
                    {sabbathTimer.m}m {sabbathTimer.s}s
                  </strong>
                </p>
              ) : (
                <p>Sabbath is ongoing. Enjoy your rest!</p>
              )}
            </div>
          </section>

          {/* BIRTHDAY CORNER */}
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <Gift size={18} /> Birthday Corner
            </div>
            <div className="card">
              <div className="birthdays-grid">
                <div className="birthday-card my-birthday-card">
                  {birthday ? (
                    birthday.isBirthday ? (
                      <>🎉 Happy Birthday, {user.full_name}! 🎉</>
                    ) : (
                      <>
                        Your birthday is on{" "}
                        {new Date(
                          birthday.birthday
                        ).toLocaleDateString()} –{" "}
                        {birthday.daysLeft} days left
                      </>
                    )
                  ) : (
                    <p>Your birthday is not set yet.</p>
                  )}
                </div>

                {todayBirthdays.map((b) => (
                  <div
                    key={b.id}
                    className="birthday-card birthday-today"
                  >
                    🎉 {b.full_name}
                  </div>
                ))}

                {upcomingBirthdays.map((b) => (
                  <div
                    key={b.id}
                    className="birthday-card birthday-upcoming"
                  >
                    {b.full_name} – {b.daysUntil} days
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
