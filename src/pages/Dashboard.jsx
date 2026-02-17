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

/* ---------------- Helpers ---------------- */
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

/* ---------------- Dashboard ---------------- */
export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [verse, setVerse] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [churchName, setChurchName] = useState("Your Church");
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [sabbathTimer, setSabbathTimer] = useState(null);

  const isGuest = user?.role_name === "Guest";
  const churchId = user?.church_id;

  /* Greeting */
  const greeting = useMemo(() => {
    const name = user?.full_name || "Child of God";
    const hour = new Date().getHours();
    if (isSabbathNow()) return `Happy Sabbath, ${name}!`;
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  }, [user]);

  /* Sabbath Timer */
  useEffect(() => {
    const timer = setInterval(() => {
      setSabbathTimer(isSabbathNow() ? null : timeDiff(nextSabbathStart()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* Fetch Data */
  useEffect(() => {
    if (!user) return;
    let alive = true;

    const fetchData = async () => {
      try {
        const results = await Promise.all([
          getDailyVerse(),
          churchId ? ChurchAPI.getById(churchId) : null,
          !isGuest ? getMyBirthday() : null,
          !isGuest ? getTodaysBirthdays(churchId) : [],
          !isGuest ? getUpcomingBirthdays(churchId, 30) : [],
          !isGuest ? AnnouncementsAPI.fetch(churchId, 5) : [],
          isGuest ? MembershipAPI.myRequests() : null,
        ]);

        if (!alive) return;

        setVerse(results[0]);
        setChurchName(results[1]?.name || user.church_name || "Your Church");

        if (isGuest) {
          setMembershipStatus(results[6]?.request?.status || null);
        } else {
          setBirthday(results[2]);
          setTodayBirthdays(results[3]);
          setUpcomingBirthdays(results[4]);
          setAnnouncements(results[5]);
        }
      } finally {
        alive && setLoading(false);
      }
    };

    fetchData();
    return () => (alive = false);
  }, [user, churchId, isGuest]);

  if (authLoading || loading) {
    return <Loader message="Preparing your dashboard…" />;
  }

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

      {/* QUICK LINKS */}
      {!isGuest && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <Coffee size={18} /> Quick Links
          </div>

          <div className="dashboard-actions">
            {hasRole(user.role_name, ["Treasurer", "Admin", "Pastor"]) && (
              <Link to="/dashboard/treasury" className="dashboard-action-card">
                <h3><Coffee size={18} /> Treasury</h3>
                <p>Church finances</p>
              </Link>
            )}

            {hasRole(user.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
              <Link to="/dashboard/youth" className="dashboard-action-card">
                <h3><Users size={18} /> Youth Ministry</h3>
                <p>Activities & attendance</p>
              </Link>
            )}

            {isAdmin(user.role_name) && (
              <Link to="/dashboard/admin" className="dashboard-action-card">
                <h3><UserPlus size={18} /> Administration</h3>
                <p>Members & roles</p>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ANNOUNCEMENTS */}
      {!isGuest && announcements.length > 0 && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <Megaphone size={18} /> Announcements
          </div>

          <div className="card">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <h4>{a.title}</h4>
                <p>{a.message}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SABBATH TRACKER */}
      {!isGuest && sabbathTimer && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <Calendar size={18} /> Sabbath Tracker
            <span>Sunset countdown</span>
          </div>

          <div className="card sabbath-card">
            <p>
              Sabbath begins in{" "}
              <strong>
                {sabbathTimer.d}d {sabbathTimer.h}h{" "}
                {sabbathTimer.m}m {sabbathTimer.s}s
              </strong>
            </p>
          </div>
        </section>
      )}

      {/* BIRTHDAY CORNER */}
      {!isGuest && (todayBirthdays.length > 0 || upcomingBirthdays.length > 0) && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <Gift size={18} /> Birthday Corner
          </div>

          <div className="card">
            <div className="birthdays-grid">
              {todayBirthdays.map((b) => (
                <div key={b.id} className="birthday-card birthday-today">
                  🎉 {b.full_name}
                </div>
              ))}

              {upcomingBirthdays.map((b) => (
                <div key={b.id} className="birthday-card birthday-upcoming">
                  {b.full_name} – {b.days_left} days
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
