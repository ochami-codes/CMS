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
import {
  Coffee,
  Users,
  UserPlus,
  Home,
  Calendar,
  Gift,
  Megaphone,
} from "lucide-react";

/* ------------------------- Helpers ------------------------- */
const isSabbathNow = () => {
  const now = new Date();
  const d = now.getDay();
  const h = now.getHours();
  return (d === 5 && h >= 18) || (d === 6 && h < 18);
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

/* ------------------------- Dashboard ------------------------- */
export default function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth();

  const [dataLoading, setDataLoading] = useState(true);

  const [verse, setVerse] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [churchName, setChurchName] = useState("Your Church");
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [sabbathTimer, setSabbathTimer] = useState(null);

  const isGuest = user?.role_name === "Guest";
  const churchId = profile?.church_id;

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

    let alive = true;
    setDataLoading(true);

    const requests = [
      getDailyVerse(),
      ChurchAPI.getById(churchId),
    ];

    if (!isGuest) {
      requests.push(
        getMyBirthday(),
        getTodaysBirthdays(churchId),
        getUpcomingBirthdays(churchId, 30),
        AnnouncementsAPI.fetch(churchId, 5)
      );
    } else {
      requests.push(MembershipAPI.myRequests());
    }

    Promise.all(requests)
      .then((res) => {
        if (!alive) return;

        setVerse(res[0]);
        setChurchName(res[1]?.name || "Your Church");

        if (isGuest) {
          setMembershipStatus(res[2]?.request?.status || null);
        } else {
          setBirthday(res[2]);
          setTodayBirthdays(res[3] || []);
          setUpcomingBirthdays(res[4] || []);
          setAnnouncements(res[5] || []);
        }
      })
      .catch(console.error)
      .finally(() => alive && setDataLoading(false));

    return () => {
      alive = false;
    };
  }, [profile, isGuest, churchId]);

  /* ---------------- Membership Request ---------------- */
  const handleRequestMembership = async () => {
    try {
      await MembershipAPI.submit({});
      setMembershipStatus("pending");
      alert("Membership request submitted 🙏");
    } catch (e) {
      alert(e.response?.data?.message || "Request failed");
    }
  };

  /* ---------------- Loader ---------------- */
  if (authLoading || dataLoading) {
    return <Loader message="Preparing your dashboard…" />;
  }

  /* ---------------- JSX ---------------- */
  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <div className="card">
        <h2 className="card-title">
          <Home size={18} /> {churchName}
        </h2>
        <p className="card-subtitle">{greeting}</p>
        {verse && (
          <p className="text-muted">
            <strong>{verse.reference}:</strong> {verse.text}
          </p>
        )}
      </div>

      {/* GUEST */}
      {isGuest && (
        <div className="card">
          <h3 className="card-title">Join Your Church</h3>
          <p className="card-subtitle">
            Request membership to access ministries and announcements.
          </p>
          <button
            className="btn btn-primary"
            disabled={membershipStatus === "pending"}
            onClick={handleRequestMembership}
          >
            {membershipStatus === "pending"
              ? "Request Pending"
              : "Request Membership"}
          </button>
        </div>
      )}

      {/* MEMBER QUICK ACTIONS */}
      {!isGuest && (
        <div className="dashboard-actions">
          {hasRole(profile.role_name, ["Treasurer", "Admin", "Pastor"]) && (
            <Link to="/dashboard/treasury" className="dashboard-action-card">
              <h3><Coffee size={18} /> Treasury</h3>
              <p>Church finances</p>
            </Link>
          )}

          {hasRole(profile.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
            <Link to="/dashboard/youth" className="dashboard-action-card">
              <h3><Users size={18} /> Youth Ministry</h3>
              <p>Activities & attendance</p>
            </Link>
          )}

          {isAdmin(profile.role_name) && (
            <Link to="/dashboard/admin" className="dashboard-action-card">
              <h3><UserPlus size={18} /> Administration</h3>
              <p>Members & roles</p>
            </Link>
          )}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {!isGuest && (
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
              </div>
            ))
          )}
        </div>
      )}

      {/* SABBATH COUNTDOWN */}
      {!isGuest && sabbathTimer && (
        <div className="card dashboard-info-card">
          <Calendar size={18} />
          <p>
            Sabbath begins in{" "}
            <strong>
              {sabbathTimer.d}d {sabbathTimer.h}h {sabbathTimer.m}m{" "}
              {sabbathTimer.s}s
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
