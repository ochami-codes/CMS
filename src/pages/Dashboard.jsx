import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { canUser } from "../utils/permissions";
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

import {
  Home,
  Coffee,
  Users,
  UserPlus,
  Calendar,
  Gift,
  Megaphone,
  MessageCircle,
} from "lucide-react";

/* ================= HELPERS ================= */

const getNextBirthday = (dob) => {
const today = new Date();
let next = new Date(
today.getFullYear(),
dob.getMonth(),
dob.getDate()
);
if (next < today) {
next.setFullYear(today.getFullYear() + 1);
}
return next;
};

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
  else if (!(day === 5 && hour < 18))
    start.setDate(now.getDate() + (12 - day));

  start.setHours(18, 0, 0, 0);
  return start;
};

const timeDiff = (target, now) => {
  const diff = target - now;
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verse, setVerse] = useState(null);
  const [churchName, setChurchName] = useState("Your Church");

  const [announcements, setAnnouncements] = useState([]);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  const [membershipStatus, setMembershipStatus] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [now, setNow] = useState(new Date());

  const isGuest = user?.role_name === "Guest";
  const isAdmin = user?.role_name ==="Admin";
  const role = user?.role_name;
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

  /* ================= TIMERS ================= */

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const sabbathTimer = useMemo(() => {
    if (isSabbathNow()) return null;
    return timeDiff(nextSabbathStart(), now);
  }, [now]);

// Birthday Timer
const birthdayTimer = useMemo(() => {
if (!birthday?.birthday) return null;
const dob = new Date(birthday.birthday);
const nextBirthday = getNextBirthday(dob);
return timeDiff(nextBirthday, now);
}, [birthday, now]);
  /* ================= DATA ================= */

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [
          dailyVerse,
          church,
          anns,
          myBirthday,
          todays,
          upcoming,
          membership,
        ] = await Promise.all([
          getDailyVerse(),
          churchId ? ChurchAPI.getById(churchId) : null,
          AnnouncementsAPI.fetch(churchId, 10),
          !isGuest ? getMyBirthday() : null,
          !isGuest ? getTodaysBirthdays(churchId) : [],
          !isGuest ? getUpcomingBirthdays(churchId, 30) : [],
          isGuest ? MembershipAPI.myRequests() : null,
        ]);

        setVerse(dailyVerse);
        setChurchName(church?.name || "Your Church");
        setAnnouncements(anns || []);
        setTodayBirthdays(todays || []);
        setUpcomingBirthdays(upcoming || []);
        setBirthday(myBirthday?.birthday || null);

        if (isGuest) {
          setMembershipStatus(
            membership?.request?.membership_request_status || null
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, churchId, isGuest]);

  /* ================= ACTION HANDLER ================= */
// Actions
const actions = [
  { key: "request_role", label: "Request Role", hideForAdmin: true },
  { key: "transfer", label: "Membership Transfer" },
  { key: "lesson", label: "Lesson Subscription" },
  { key: "admin", label: "Message Admin" },
  { key: "pastor", label: "Message Pastor" },
  { key: "leader", label: "Message Leaders" },
];


  const handleAction = async (type) => {
    try {
      setActionLoadingId(type);

      switch (type) {
        case "request_role":
          navigate("/myrolerequest");
          break;

        case "transfer":
          alert("Request transfer");
          break;

        case "lesson":
          alert("Subscribe lesson");
          break;

        case "admin":
        case "pastor":
        case "leader":
          alert("Open messaging modal");
          break;

        default:
          break;
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ================= FILTER ANNOUNCEMENTS ================= */

  const filteredAnnouncements = announcements.filter((a) => {
    if (a.target === "all") return true;
    if (a.target === role) return true;
    if (a.target === user?.department_name) return true;
    return false;
  });

  /* ================= UI ================= */

  return (
    <div className="dashboard-content">
      {/* HEADER */}
      <section className="dashboard-section">
        <div className="card">
          <h2>
            <Home size={18} /> {churchName}
          </h2>
          <p>{greeting}</p>
          {verse && (
            <p>
              <strong>{verse.reference}</strong>: {verse.text}
            </p>
          )}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      {!isGuest && (
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <Coffee size={18} /> Quick Actions
          </div>

          <div className="dashboard-actions">
  {actions
  .filter((a) => !(a.hideForAdmin && isAdmin(role)))
  .map((a) => (
    <button
      key={a.key}
      className="dashboard-action-card"
      onClick={() => handleAction(a.key)}
      disabled={actionLoadingId === a.key}
    >
      <h3>{a.label}</h3>
    </button>
))}
          </div>
        </section>
      )}

      {/* ROLE-BASED TOOLS */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <Users size={18} /> Tools
        </div>

        <div className="dashboard-actions">
          {canUser(role, "access_treasury_dashboard") && (
            <Link to="/dashboard/treasury" className="dashboard-action-card">
              Treasury
            </Link>
          )}

          {canUser(role, "manage_youth") && (
            <Link to="/dashboard/youth" className="dashboard-action-card">
              Youth
            </Link>
          )}

          {canUser(role, "access_admin_dashboard") && (
            <Link to="/dashboard/admin" className="dashboard-action-card">
              Admin
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
          {filteredAnnouncements.length ? (
            filteredAnnouncements.map((a) => (
              <div key={a.id} className="announcement-card">
                <h4>{a.title}</h4>
                <p>{a.message}</p>
              </div>
            ))
          ) : (
            <p>No announcements</p>
          )}
        </div>
      </section>

      {/* SABBATH */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <Calendar size={18} /> Sabbath
        </div>

        <div className="card">
          {sabbathTimer ? (
            <p>
              Starts in {sabbathTimer.d}d {sabbathTimer.h}h{" "}
              {sabbathTimer.m}m {sabbathTimer.s}s
            </p>
          ) : (
            <p>Sabbath ongoing</p>
          )}
        </div>
      </section>

      {/* BIRTHDAYS */}
           <section className="dashboard-section">
            <div className="dashboard-section-header">
              <Gift size={18} /> Birthday Corner
            </div>
            <div className="card">
              <div className="birthdays-grid">
                <div className="birthday-card my-birthday-card">
                 {birthday ? (
  birthday.isBirthday ? (
    <>🎉 Happy Birthday, {user.full_name}! May God's face shine on you! 🎉</>
  ) : birthdayTimer ? (
    <>
      Your birthday is in:
      <strong>
        {birthdayTimer.d}d {birthdayTimer.h}h {birthdayTimer.m}m {birthdayTimer.s}s
      </strong> May God keep you till then!
    </>
  ) : null
) : (
  <p>Your birthday is not set yet.</p>
)}
                </div>

                {todayBirthdays.map((b) => (
                  <div
                    key={b.id}
                    className="birthday-card birthday-today"
                  >
                    🎉 Let's celebrate {b.full_name}, it's their birthday!
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
   </div>
  );
}
