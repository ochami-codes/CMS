import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
  AnnouncementsAPI,
  ChurchAPI,
} from "../utils/api";
import { hasRole, isAdmin } from "../utils/permissions";

/* ======================================================
   🇰🇪 KENYA SABBATH HELPERS (6PM – 6PM)
====================================================== */
const isSabbathNow = () => {
  const now = new Date();
  const day = now.getDay(); // Fri = 5, Sat = 6
  const hour = now.getHours();

  return (day === 5 && hour >= 18) || (day === 6 && hour < 18);
};

const nextSabbathStart = () => {
  const now = new Date();
  const start = new Date(now);

  if (now.getDay() < 5) {
    start.setDate(now.getDate() + (5 - now.getDay()));
  } else if (now.getDay() === 5 && now.getHours() < 18) {
    // today
  } else {
    start.setDate(now.getDate() + (12 - now.getDay()));
  }

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

/* ======================================================
   🎂 BIRTHDAY COUNTDOWN
====================================================== */
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

/* ======================================================
   DASHBOARD
====================================================== */
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
    const name = profile?.full_name || "child of God";
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
      if (!isSabbathNow()) {
        setSabbathTimer(timeDiff(nextSabbathStart()));
      } else {
        setSabbathTimer(null);
      }
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

  if (loading) return <div className="loader" />;

  const bday = birthdayCountdown(birthday?.birthday);

  return (
    <div className="dashboard-content">
      {/* Greeting */}
      <div className="greeting-card">
        <h2>{greeting}</h2>
        {verse && (
          <p>
            <strong>{verse.reference}:</strong> {verse.text}
          </p>
        )}
      </div>

      {/* Church */}
      {church && (
        <div className="card">
          <h3>⛪ My Church</h3>
          <p>{church}</p>
        </div>
      )}

      {/* Sabbath Countdown */}
      {!isSabbathNow() && sabbathTimer && (
        <div className="card">
          <h3>🌅 Sabbath Countdown</h3>
          <p>
            Begins in{" "}
            <strong>
              {sabbathTimer.d}d {sabbathTimer.h}h {sabbathTimer.m}m{" "}
              {sabbathTimer.s}s
            </strong>
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="stats-grid">
        {hasRole(profile.role_name, ["Treasurer", "Admin", "Pastor"]) && (
          <Link to="/dashboard/treasury" className="stat-card">
            <h3>💰 Treasury</h3>
            <p>View church finances</p>
          </Link>
        )}
        {hasRole(profile.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
          <Link to="/dashboard/youth" className="stat-card">
            <h3>🧑‍🤝‍🧑 Youth Ministry</h3>
            <p>Attendance & programs</p>
          </Link>
        )}
        {isAdmin(profile.role_name) && (
          <Link to="/dashboard/admin" className="stat-card">
            <h3>🛠 Admin Panel</h3>
            <p>Members & roles</p>
          </Link>
        )}
      </div>

      {/* Birthday */}
      {birthday?.birthday && (
        <div className="card">
          {birthday.isBirthday ? (
            <>
              <h3>🎉 Happy Birthday!</h3>
              <p>“The Lord bless you and keep you” — Numbers 6:24</p>
            </>
          ) : (
            <>
              <h3>🎈 Birthday Countdown</h3>
              {bday && (
                <p>
                  In{" "}
                  <strong>
                    {bday.months}m {bday.days}d {bday.hours}h{" "}
                    {bday.minutes}m {bday.seconds}s
                  </strong>
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Other Birthdays */}
      {(todayBirthdays.length > 0 || upcomingBirthdays.length > 0) && (
        <div className="card">
          <h3>🎂 Church Birthdays</h3>
          <div className="stats-grid">
            {todayBirthdays.map((b) => (
              <div key={b.id} className="stat-card">
                <h4>{b.full_name}</h4>
                <p>Today 🎉</p>
              </div>
            ))}
            {upcomingBirthdays.map((b) => (
              <div key={b.id} className="stat-card">
                <h4>{b.full_name}</h4>
                <p>Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Announcements */}
      <div className="announcement-section">
        <h3>📢 Announcements</h3>
        {announcements.length === 0 ? (
          <p>No recent announcements.</p>
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
    </div>
  );
}
