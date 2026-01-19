import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDailyVerse, getAnnouncements, getMyBirthday, getTodaysBirthdays } from "../utils/api";

export default function Dashboard() {
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [verse, setVerse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [myBirthday, setMyBirthday] = useState(false);
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Greeting
  useEffect(() => {
    const now = new Date();
    let greet = "Hello";
    if (now.getHours() < 12) greet = "Good morning";
    else if (now.getHours() < 18) greet = "Good afternoon";
    else greet = "Good evening";

    if (now.getDay() === 6) greet = "Happy Sabbath";
    setGreeting(`${greet}, ${profile?.full_name || "Friend"}!`);
  }, [profile]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [verseData, annData, myBdayData, birthdaysData] = await Promise.all([
          getDailyVerse(),
          getAnnouncements(profile?.church_id),
          getMyBirthday(),
          getTodaysBirthdays(profile?.church_id),
        ]);

        setVerse(verseData);
        setAnnouncements(annData);
        setMyBirthday(myBdayData.isBirthday);
        setTodaysBirthdays(birthdaysData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile?.church_id]);

  if (loading) return <div className="loader" />;

  return (
    <div className="dashboard-content">
      {/* Greeting Card */}
      <div className="greeting-card">
        <h2>{greeting}</h2>
        {verse && <p><strong>{verse.reference}:</strong> {verse.text}</p>}
      </div>

      {/* Birthday Cards */}
      {myBirthday && (
        <div className="birthday-card personal">
          <h3>🎉 Happy Birthday!</h3>
          <p>“The Lord bless you and keep you” — Numbers 6:24</p>
        </div>
      )}
      {todaysBirthdays.length > 0 && (
        <div className="birthday-list">
          <h3 className="section-title">🎂 Birthdays Today</h3>
          <ul>{todaysBirthdays.map(b => <li key={b.id}>{b.full_name}</li>)}</ul>
        </div>
      )}

      {/* Announcements */}
      <div className="announcement-section">
        <h3 className="section-title">Recent Announcements</h3>
        {announcements.length === 0 ? <p>No recent announcements.</p> :
          <div className="event-list">
            {announcements.map(a => (
              <div key={a.id} className="announcement-card">
                <h4 className="announcement-title">{a.title}</h4>
                <p className="announcement-message">{a.message}</p>
                <span className="announcement-date">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
