import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  AnnouncementsAPI,
  getUpcomingBirthdays, // new API call
} from "../utils/api";
import { hasRole, isAdmin } from "../utils/permissions";

/* ---------------- Helper: calculate days until next birthday ---------------- */
function daysUntilBirthday(birthday) {
  if (!birthday) return null;

  const today = new Date();
  const bday = new Date(birthday);

  // Set next birthday to this year
  let nextBirthday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());

  // If birthday already passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextBirthday - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const { profile } = useAuth();

  const [greeting, setGreeting] = useState("Good evening, child of God ❤️");
  const [verse, setVerse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [birthdayInfo, setBirthdayInfo] = useState(null);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Greeting ---------------- */
  useEffect(() => {
    const name = profile?.fullName || "child of God";
    const now = new Date();
    let greet = "Hello";

    if (now.getHours() < 12) greet = "Good morning";
    else if (now.getHours() < 18) greet = "Good afternoon";
    else greet = "Good evening";

    if (now.getDay() === 6) greet = "Happy Sabbath";

    setGreeting(`${greet}, ${name}!`);
  }, [profile]);

  /* ---------------- Fetch Dashboard Data ---------------- */
  useEffect(() => {
    const churchId = profile?.church_id;
    if (!profile) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const [verseData, annData, myBday, todaysBdays, upcomingBdays] =
          await Promise.all([
            getDailyVerse(),
            churchId ? AnnouncementsAPI.fetch(churchId, 5) : Promise.resolve([]),
            getMyBirthday(),
            churchId ? getTodaysBirthdays(churchId) : Promise.resolve([]),
            churchId ? getUpcomingBirthdays(churchId, 30) : Promise.resolve([]),
          ]);

        setVerse(verseData);
        setAnnouncements(annData || []);
        setBirthdayInfo(myBday || null);
        setTodaysBirthdays(todaysBdays || []);
        setUpcomingBirthdays(upcomingBdays || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  if (loading) return <div className="loader" />;

  const myBirthdayCountdown = birthdayInfo?.date_of_birth
    ? daysUntilBirthday(birthdayInfo.date_of_birth)
    : null;

  return (
    <div className="dashboard-content space-y-6">
      {/* Greeting + Verse */}
      <div className="greeting-card">
        <h2>{greeting}</h2>
        {verse && (
          <p>
            <strong>{verse.reference}:</strong> {verse.text}
          </p>
        )}
      </div>

      {/* Quick Actions (Role-Based) */}
      {profile && (
        <div className="grid md:grid-cols-3 gap-4">
          {hasRole(profile.role_name, ["Treasurer", "Admin", "Pastor"]) && (
            <Link to="/dashboard/treasury" className="dashboard-card">
              <h3>💰 Treasury</h3>
              <p>View funds, offerings, and reports</p>
            </Link>
          )}
          {hasRole(profile.role_name, ["Youth_leader", "Admin", "Pastor"]) && (
            <Link to="/dashboard/youth" className="dashboard-card">
              <h3>🧑‍🤝‍🧑 Youth Ministry</h3>
              <p>Manage youth attendance & programs</p>
            </Link>
          )}
          {isAdmin(profile.role_name) && (
            <Link to="/dashboard/admin" className="dashboard-card">
              <h3>🛠 Admin Panel</h3>
              <p>Manage members, roles, and settings</p>
            </Link>
          )}
        </div>
      )}

      {/* Personal Birthday / Countdown */}
      {birthdayInfo?.date_of_birth && (
        <div className={`birthday-card ${birthdayInfo.isBirthday ? "personal" : ""}`}>
          {birthdayInfo.isBirthday ? (
            <>
              <h3>🎉 Happy Birthday!</h3>
              <p>“The Lord bless you and keep you” — Numbers 6:24</p>
            </>
          ) : (
            <>
              <h3>🎈 Your Birthday Countdown</h3>
              <p>Your birthday is in <strong>{myBirthdayCountdown}</strong> day{myBirthdayCountdown > 1 ? "s" : ""}</p>
            </>
          )}
        </div>
      )}

      {/* Today's / Upcoming Birthdays */}
      {(todaysBirthdays.length > 0 || upcomingBirthdays.length > 0) && (
        <div className="birthday-list">
          <h3 className="section-title">🎂 Upcoming Birthdays</h3>
          <ul>
            {todaysBirthdays.map((b) => (
              <li key={b.id}>
                {b.full_name} — Today!
              </li>
            ))}
            {upcomingBirthdays.map((b) => (
              <li key={b.id}>
                {b.full_name} — in {daysUntilBirthday(b.date_of_birth)} day{daysUntilBirthday(b.date_of_birth) > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Announcements */}
      <div className="announcement-section">
        <h3 className="section-title">📢 Recent Announcements</h3>
        {announcements.length === 0 ? (
          <p>No recent announcements.</p>
        ) : (
          <div className="event-list">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <h4>{a.title}</h4>
                <p>{a.message}</p>
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
