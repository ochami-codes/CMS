import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  AnnouncementsAPI,
} from "../utils/api";
import { hasRole, isAdmin } from "../utils/permissions";

export default function Dashboard() {
  const { profile } = useAuth();

  const [greeting, setGreeting] = useState("");
  const [verse, setVerse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [myBirthday, setMyBirthday] = useState(false);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Greeting ------------------ */
  useEffect(() => {
    if (!profile) return;

    const now = new Date();
    let greet = "Hello";

    if (now.getHours() < 12) greet = "Good morning";
    else if (now.getHours() < 18) greet = "Good afternoon";
    else greet = "Good evening";

    if (now.getDay() === 6) greet = "Happy Sabbath";

    setGreeting(`${greet}, ${profile.full_name}!`);
  }, [profile]);

  /* ------------------ Fetch Dashboard Data ------------------ */
  useEffect(() => {
    if (!profile?.church_id) return;

    setLoading(true);

    const fetchDashboardData = async () => {
      try {
        const [
          verseData,
          announcementsData,
          myBirthdayData,
          birthdaysData,
        ] = await Promise.all([
          getDailyVerse(),
          AnnouncementsAPI.fetch(profile.church_id, 5),
          getMyBirthday(),
          getTodaysBirthdays(profile.church_id),
        ]);

        setVerse(verseData);
        setAnnouncements(announcementsData ?? []);
        setMyBirthday(myBirthdayData?.isBirthday ?? false);
        setTodaysBirthdays(birthdaysData ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile?.church_id]);

  if (loading) return <div className="loader" />;

  return (
    <div className="dashboard-content space-y-6">
      {/* Greeting */}
      <div className="greeting-card">
        <h2>{greeting}</h2>
        {verse && (
          <p>
            <strong>{verse.reference}:</strong> {verse.text}
          </p>
        )}
      </div>

      {/* Quick Actions */}
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

      {/* Birthdays */}
      {myBirthday && (
        <div className="birthday-card personal">
          <h3>🎉 Happy Birthday!</h3>
          <p>“The Lord bless you and keep you” — Numbers 6:24</p>
        </div>
      )}

      {todaysBirthdays.length > 0 && (
        <div className="birthday-list">
          <h3 className="section-title">🎂 Birthdays Today</h3>
          <ul>
            {todaysBirthdays.map((b) => (
              <li key={b.id}>{b.full_name}</li>
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
                <span>
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
