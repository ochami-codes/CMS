// src/pages/Dashboard.jsx
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

import { Coffee, Users, UserPlus, Home, Calendar, Gift, Megaphone } from "lucide-react";

/* ------------------------- Helpers ------------------------- */
const isSabbathNow = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return (day === 5 && hour >= 18) || (day === 6 && hour < 18);
};

const nextSabbathStart = () => {
  const now = new Date();
  const start = new Date(now);
  if (now.getDay() < 5) start.setDate(now.getDate() + (5 - now.getDay()));
  else if (!(now.getDay() === 5 && now.getHours() < 18))
    start.setDate(now.getDate() + (12 - now.getDay()));
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

const birthdayCountdown = (dob) => {
  if (!dob) return null;
  const now = new Date();
  const b = new Date(dob);
  let next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
  if (next < now) next.setFullYear(now.getFullYear() + 1);
  const diff = timeDiff(next);
  if (!diff) return null;
  return {
    months: Math.floor(diff.d / 30),
    days: diff.d % 30,
    hours: diff.h,
    minutes: diff.m,
    seconds: diff.s,
  };
};

/* ------------------------- Dashboard ------------------------- */
export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();

  const [verse, setVerse] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [churchName, setChurchName] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [sabbathTimer, setSabbathTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  const isGuest = user?.role_name === "Guest";
  const isMember = !isGuest;

  /* ---------------- Greeting ---------------- */
  const greeting = useMemo(() => {
    const name = profile?.full_name || "Child of God";
    const hour = new Date().getHours();
    if (isSabbathNow()) return `Happy Sabbath, ${name}!`;
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  }, [profile]);

  /* ---------------- Sabbath Countdown ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      setSabbathTimer(isSabbathNow() ? null : timeDiff(nextSabbathStart()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- Fetch Dashboard Data ---------------- */
  useEffect(() => {
    if (!profile) return;
    setLoading(true);

    const churchId = profile.church_id;

    const promises = [
      getDailyVerse(),
      getMyBirthday(),
      churchId ? getTodaysBirthdays(churchId) : Promise.resolve([]),
      churchId ? getUpcomingBirthdays(churchId, 30) : Promise.resolve([]),
      churchId ? AnnouncementsAPI.fetch(churchId, 5) : Promise.resolve([]),
      churchId ? ChurchAPI.getById(churchId) : Promise.resolve(null),
      isGuest ? MembershipAPI.myRequests() : Promise.resolve(null),
    ];

    Promise.all(promises)
      .then(
        ([
          verseData,
          myBirthday,
          todays,
          upcoming,
          ann,
          churchData,
          membershipData,
        ]) => {
          setVerse(verseData || null);
          setBirthday(myBirthday || null);
          setTodayBirthdays(todays || []);
          setUpcomingBirthdays(upcoming || []);
          setAnnouncements(ann || []);
          setChurchName(churchData?.name || profile?.church_name || "Your Church");
          if (membershipData?.request) {
            setMembershipStatus(membershipData.request.status);
          }
        }
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile]);

  /* ---------------- Membership Request ---------------- */
  const handleRequestMembership = async () => {
    if (!profile?.church_id) {
      alert("No church selected.");
      return;
    }
    setRequestLoading(true);
    try {
      await MembershipAPI.submit({});
      setMembershipStatus("pending");
      alert("Membership request submitted! 🙏");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setRequestLoading(false);
    }
  };

  /* ---------------- Loader ---------------- */
  if (authLoading || loading || !profile) {
    return <Loader message="God loves you..." />;
  }

  const bdayCountdown = birthdayCountdown(birthday?.birthday);

  /* ---------------- JSX ---------------- */
  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <div className="card">
        <h2 className="card-title">
          <Home size={20} /> {churchName}
        </h2>
        <p className="card-subtitle">{greeting}</p>
        {verse && (
          <p className="text-muted">
            <strong>{verse.reference}:</strong> {verse.text}
          </p>
        )}
      </div>

      {/* GUEST MEMBERSHIP */}
      {isGuest && (
        <div className="card">
          <h3 className="card-title">Join Your Church</h3>
          <p className="card-subtitle">
            Become a full member to access ministries and announcements.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleRequestMembership}
            disabled={requestLoading || membershipStatus === "pending"}
          >
            {membershipStatus === "pending"
              ? "Request Pending"
              : "Request Membership"}
          </button>
        </div>
      )}

      {/* QUICK ACTIONS FOR MEMBERS */}
      {isMember && (
        <div className="dashboard-actions">
          {hasRole(profile.role_name, ["Treasurer", "Admin", "Pastor"]) && (
            <Link to="/dashboard/treasury" className="dashboard-action-card">
              <h3><Coffee size={18} /> Treasury</h3>
              <p>Church finances & reports</p>
            </Link>
          )}

          {hasRole(profile.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
            <Link to="/dashboard/youth" className="dashboard-action-card">
              <h3><Users size={18} /> Youth Ministry</h3>
              <p>Attendance & activities</p>
            </Link>
          )}

          {isAdmin(profile.role_name) && (
            <Link to="/dashboard/admin" className="dashboard-action-card">
              <h3><UserPlus size={18} /> Administration</h3>
              <p>Members, roles & permissions</p>
            </Link>
          )}
        </div>
      )}

      {/* SABBATH COUNTDOWN */}
      {isMember && !isSabbathNow() && sabbathTimer && (
        <div className="dashboard-info-card card">
          <Calendar size={18} />
          <p>
            Sabbath begins in{" "}
            <strong>
              {sabbathTimer.d}d {sabbathTimer.h}h {sabbathTimer.m}m {sabbathTimer.s}s
            </strong>
          </p>
        </div>
      )}

      {/* PERSONAL BIRTHDAY */}
      {isMember && birthday?.birthday && (
        <div className="dashboard-birthday-card card">
          {birthday.isBirthday ? (
            <>
              <h3><Gift size={18} /> Happy Birthday!</h3>
              <p>“The Lord bless you and keep you” — Numbers 6:24</p>
            </>
          ) : (
            <>
              <h3><Gift size={18} /> Your Birthday Countdown</h3>
              {bdayCountdown && (
                <p>
                  In{" "}
                  <strong>
                    {bdayCountdown.months}m {bdayCountdown.days}d {bdayCountdown.hours}h {bdayCountdown.minutes}m {bdayCountdown.seconds}s
                  </strong>
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {isMember && (
        <div className="card">
          <h3 className="card-title">
            <Megaphone size={18} /> Announcements
          </h3>

          {announcements.length === 0 ? (
            <p className="card-subtitle">No recent announcements.</p>
          ) : (
            announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <h4>{a.title}</h4>
                <p>{a.message}</p>
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
