import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
  AnnouncementsAPI,
  ChurchAPI,
} from "../utils/api";
import { hasRole, isAdmin } from "../utils/permissions";

// Lucide Icons
import { Coffee, Users, UserPlus, Home, Calendar, Gift, Megaphone } from "lucide-react";

/* ========================
   KENYA SABBATH HELPERS
======================== */
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
  else if (now.getDay() === 5 && now.getHours() < 18) {}
  else start.setDate(now.getDate() + (12 - now.getDay()));
  start.setHours(18, 0, 0, 0);
  return start;
};

const timeDiff = (target) => {
  const diff = target - new Date();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000) % 60;
  const m = Math.floor(diff / (1000 * 60)) % 60;
  const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { d, h, m, s };
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

/* ========================
   DASHBOARD
======================== */
export default function Dashboard() {
  const { profile } = useAuth();

  const [greeting, setGreeting] = useState("");
  const [verse, setVerse] = useState(null);
  const [church, setChurch] = useState(null);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sabbathTimer, setSabbathTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Greeting ---------------- */
  useEffect(() => {
    const name = profile?.full_name || "Child of God";
    const hour = new Date().getHours();
    let greet;
    if (isSabbathNow()) greet = "Happy Sabbath";
    else if (hour < 12) greet = "Good morning";
    else if (hour < 18) greet = "Good afternoon";
    else greet = "Good evening";
    setGreeting(`${greet}, ${name}!`);
  }, [profile]);

  /* ---------------- Sabbath Countdown ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSabbathNow()) setSabbathTimer(timeDiff(nextSabbathStart()));
      else setSabbathTimer(null);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    if (!profile) return;

    const churchId = profile.church_id;
    setLoading(true);

    Promise.all([
      getDailyVerse(),
      getMyBirthday(),
      churchId ? getTodaysBirthdays(churchId) : [],
      churchId ? getUpcomingBirthdays(churchId, 30) : [],
      churchId ? AnnouncementsAPI.fetch(churchId, 5) : [],
      churchId ? ChurchAPI.getById(churchId) : null,
    ])
      .then(
        ([
          verseData,
          myBirthday,
          todays,
          upcoming,
          ann,
          churchData,
        ]) => {
          setVerse(verseData);
          setBirthday(myBirthday);
          setTodayBirthdays(todays || []);
          setUpcomingBirthdays(upcoming || []);
          setAnnouncements(ann || []);
          setChurch(churchData?.name || null);
        }
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile]);

  /* ---------------- Loader ---------------- */
  if (loading) return <Loader message="God loves you..." />;

  const bday = birthdayCountdown(birthday?.birthday);

return (
  <div className="dashboard-content">

    {/* ======================
       DASHBOARD HEADER
    ====================== */}
    <div className="card">
      <h2 className="card-title">
        <Home size={20} /> {church || "Your Church"}
      </h2>
      <p className="card-subtitle">{greeting}</p>

      {verse && (
        <p className="text-muted">
          <strong>{verse.reference}:</strong> {verse.text}
        </p>
      )}
    </div>

    {/* ======================
       QUICK ACTIONS
    ====================== */}
    <div className="dashboard-actions">
      {hasRole(profile.role_name, ["Treasurer", "Admin", "Pastor"]) && (
        <Link to="/dashboard/treasury" className="dashboard-action-card">
          <h3>
            <Coffee size={18} /> Treasury
          </h3>
          <p>Church finances & reports</p>
        </Link>
      )}

      {hasRole(profile.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
        <Link to="/dashboard/youth" className="dashboard-action-card">
          <h3>
            <Users size={18} /> Youth Ministry
          </h3>
          <p>Attendance & activities</p>
        </Link>
      )}

      {isAdmin(profile.role_name) && (
        <Link to="/dashboard/admin" className="dashboard-action-card">
          <h3>
            <UserPlus size={18} /> Administration
          </h3>
          <p>Members, roles & permissions</p>
        </Link>
      )}
    </div>

    {/* ======================
       SABBATH STATUS
    ====================== */}
    {!isSabbathNow() && sabbathTimer && (
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

    {/* ======================
       PERSONAL BIRTHDAY
    ====================== */}
    {birthday?.birthday && (
      <div className="dashboard-birthday-card card">
        {birthday.isBirthday ? (
          <>
            <h3>
              <Gift size={18} /> Happy Birthday!
            </h3>
            <p>“The Lord bless you and keep you” — Numbers 6:24</p>
          </>
        ) : (
          <>
            <h3>
              <Gift size={18} /> Your Birthday Countdown
            </h3>
            {bday && (
              <p>
                In{" "}
                <strong>
                  {bday.months}m {bday.days}d {bday.hours}h {bday.minutes}m {bday.seconds}s
                </strong>
              </p>
            )}
          </>
        )}
      </div>
    )}

    {/* ======================
       CHURCH BIRTHDAYS
    ====================== */}
    {(todayBirthdays.length > 0 || upcomingBirthdays.length > 0) && (
      <div className="card">
        <h3 className="card-title">
          <Gift size={18} /> Church Birthdays
        </h3>

        <div className="birthdays-grid">
          {todayBirthdays.map(b => (
            <div key={b.id} className="birthday-card">
              <h4>{b.full_name}</h4>
              <p className="birthday-today">Today 🎉</p>
            </div>
          ))}

          {upcomingBirthdays.map(b => (
            <div key={b.id} className="birthday-card">
              <h4>{b.full_name}</h4>
              <p className="birthday-upcoming">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ======================
       ANNOUNCEMENTS
    ====================== */}
    <div className="card">
      <h3 className="card-title">
        <Megaphone size={18} /> Announcements
      </h3>

      {announcements.length === 0 ? (
        <p className="card-subtitle">No recent announcements.</p>
      ) : (
        announcements.map(a => (
          <div key={a.id} className="announcement-card">
            <h4>{a.title}</h4>
            <p>{a.message}</p>
            <span>{new Date(a.created_at).toLocaleDateString()}</span>
          </div>
        ))
      )}
    </div>

  </div>
);
}
