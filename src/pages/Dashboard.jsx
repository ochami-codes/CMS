import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "../styles/pages.css";
import { respondToInvite } from "../utils/membershipActions";
import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
  AnnouncementsAPI,
  ChurchAPI,
  MembershipAPI,
  MessagesAPI,
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
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verse, setVerse] = useState(null);
  const [churchName, setChurchName] = useState("Your Church");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [loadingMembershipRequest, setLoadingMembershipRequest] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [membershipError, setMembershipError] = useState("");  
const [actionLoadingId, setActionLoadingId] = useState(null);
 const [now, setNow] = useState(new Date());
const [initialized, setInitialized] = useState(false);
  const [membershipData, setMembershipData] = useState(null);
const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const role = user?.role_name?.toLowerCase() || "guest";
  const isGuest = role === "guest";
  const isAdmin = role === "admin";
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
  if (!user || initialized) return;

  const cached = sessionStorage.getItem("dashboardData");

  // 🔥 1. Load from cache instantly
  if (cached) {
    try {
      const data = JSON.parse(cached);

      setVerse(data.verse || null);
      setChurchName(data.churchName || "Your Church");
      setAnnouncements(data.announcements || []);
      setTodayBirthdays(data.todayBirthdays || []);
      setUpcomingBirthdays(data.upcomingBirthdays || []);
      setBirthday(data.birthday || null);
      setMembershipStatus(data.membershipStatus || null);

      setLoading(false);      // ⚡ no loader
      setInitialized(true);   // ⚡ skip blocking

    } catch (e) {
      console.warn("Cache parse failed:", e);
    }
  }

  // 🔄 2. Always fetch fresh data (but silently)
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

      const newData = {
        verse: dailyVerse,
        churchName: church?.name || "Your Church",
        announcements: anns || [],
        todayBirthdays: todays || [],
        upcomingBirthdays: upcoming || [],
        birthday: myBirthday?.birthday || null,
        membershipStatus: isGuest ? membership?.membership_status || null : null,
membershipData: isGuest ? membership?.membership || null : null,
hasActiveRequest: isGuest ? membership?.has_active_request || false : false,
      };

      // ✅ Update UI
      setVerse(newData.verse);
      setChurchName(newData.churchName);
      setAnnouncements(newData.announcements);
      setTodayBirthdays(newData.todayBirthdays);
      setUpcomingBirthdays(newData.upcomingBirthdays);
      setBirthday(newData.birthday);
      if (isGuest) {
  setMembershipStatus(newData.membershipStatus);
  setMembershipData(membership?.membership || null);
  setHasActiveRequest(membership?.has_active_request || false);
}

      // 💾 Save cache
      sessionStorage.setItem("dashboardData", JSON.stringify(newData));

    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  fetchData();
}, [user, churchId, isGuest, initialized]);

useEffect(() => {
  // fetch unread messages count
  const fetchUnread = async () => {
    try {
      const res = await MessagesAPI.getUnreadCount();
      setUnreadMessages(res.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
    }
  };

  fetchUnread();
const interval = setInterval(fetchUnread, 60000);
  return () => clearInterval(interval);
}, []);

// Loader

if (!user) return null;

if (loading && !initialized) {
  return <Loader message="Loading dashboard..." />;
}
  /* ================= ACTION HANDLER ================= */
// Actions
const actions = [
  { key: "message", label: "Messages" },
  { key: "request_role", label: "Request Role", hideForAdmin: true },
  { key: "transfer", label: "Membership Transfer" },
  { key: "lesson", label: "Lesson Subscription" },
];

const handleAction = async (type) => {
  try {
    setActionLoadingId(type);

    switch (type) {
      case "request_role":
        if (isGuest || isAdmin) return;
        navigate("/myrolerequest");
        break;

      case "transfer":
        alert("Request transfer");
        break;

      case "lesson":
        alert("Subscribe lesson");
        break;

      case "message":
        navigate("/dashboard/messages");
        break;

      default:
        break;
    }
  } finally {
    setActionLoadingId(null);
  }
};

const handleRespondInvite = async (action) => {
  try {
    setActionLoadingId(action);

    await respondToInvite({
      requestId: membershipData.id,
      action,
    });

    if (action === "accepted") {
      // ✅ Update UI immediately
      setMembershipStatus("accepted");
      setHasActiveRequest(false);

      // 🔥 Critical: refresh auth state
      await refreshUser();

    } else {
      // rejected
      setMembershipStatus("rejected");
      setHasActiveRequest(false);
}
  } catch (e) {
    console.error(e);
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

{/* MEMBERSHIP REQUEST SECTION */}
{isGuest && (
  <section className="dashboard-section">
    <div className="dashboard-section-header">
      <UserPlus size={18} /> Join Your Church
    </div>

    <div className="card">
      {/* MESSAGE LOGIC */}
 <p>
  {membershipStatus === "requested"
    ? "Your membership request is pending review."
    : membershipStatus === "invited"
    ? "You have been invited to join this church."
    : membershipStatus === "accepted"
    ? "Your membership has been approved 🎉"
    : membershipStatus === "rejected"
    ? "Your membership request was rejected."
    : "Request membership to access ministries and announcements."}
</p>

      {/* USER REQUEST BUTTON */}
      {!hasActiveRequest && (
        <button
          className="btn btn-primary"
          disabled={loadingMembershipRequest}
          onClick={async () => {
            try {
              setLoadingMembershipRequest(true);
              setMembershipError("");
              setSuccessMessage("");

              await MembershipAPI.submit({});
              setMembershipStatus("requested");
setHasActiveRequest(true);

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

   {membershipStatus === "invited" && membershipData && (
  <div className="invite-actions-box">
    <p className="invite-title">Church Invitation</p>

    <div className="invite-buttons">
      <button
        className="btn btn-success"
        disabled={actionLoadingId === "accepted"}
        onClick={() => handleRespondInvite("accepted")}
      >
        {actionLoadingId === "accepted" ? "Accepting..." : "Accept"}
      </button>

      <button
        className="btn btn-danger"
        disabled={actionLoadingId === "rejected"}
        onClick={() => handleRespondInvite("rejected")}
      >
        {actionLoadingId === "rejected" ? "Rejecting..." : "Reject"}
      </button>
    </div>
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

{!isGuest && (
  <>
     {/* QUICK ACTIONS */}
<section className="dashboard-section">
  <div className="dashboard-section-header">
    <Coffee size={18} /> Quick Actions
  </div>

  <div className="dashboard-actions">
    {actions
      .filter((a) => {
        // hide admin-only actions for guests if needed
        if (a.hideForAdmin && isAdmin) return false;

        // permission check: optional mapping if actions require permission
        if (a.permission) {
          return isAdmin || user.permissions?.includes(a.permission);
        }

        return true; // no permission required
      })
      .map((a) => (
<button
  key={a.key}
  className={`dashboard-action-card ${
    a.key === "message" ? "message" : ""
  }`}
  onClick={() => handleAction(a.key)}
>
          {a.key === "message" ? (
            <div className="icon-wrapper">
  <MessageCircle size={24} />

  {unreadMessages > 0 && (
    <span className="badge unread">
      {unreadMessages}
    </span>
  )}
</div>
          ) : (
            <Coffee size={24} />
          )}
          <h3>{a.label}</h3>
         {a.key === "message" && unreadMessages > 0 && (
  <small className="action-hint">
    {unreadMessages} new message{unreadMessages > 1 && "s"}
  </small>
)} 
       </button>
      ))}
  </div>
</section>
      

    {/* ROLE-BASED TOOLS */}
<section className="dashboard-section">
  <div className="dashboard-section-header">
    <Users size={18} /> Tools
  </div>

  <div className="dashboard-actions">
    {/* Treasury */}
    {(isAdmin || user.permissions?.includes("access_treasury_dashboard")) && (
      <Link to="/dashboard/treasury" className="dashboard-action-card">
        Treasury
      </Link>
    )}

    {/* Youth */}
    {(isAdmin || user.permissions?.includes("access_youth_dashboard")) && (
      <Link to="/dashboard/youth" className="dashboard-action-card">
        Youth
      </Link>
    )}

    {/* Admin */}
    {(isAdmin || user.permissions?.includes("access_admin_dashboard")) && (
      <Link to="/dashboard/admin" className="dashboard-action-card">
        Admin
      </Link>
    )}

    {/* Add more tools here following same pattern */}
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
</>
)}
   </div>
  );
}
