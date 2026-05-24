// pages/Dashboard.jsx

import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MembershipSection from "../components/dashboard/MembershipSection";
import QuickActions from "../components/dashboard/QuickActions";
import AnnouncementsSection from "../components/dashboard/AnnouncementsSection";
import SabbathSection from "../components/dashboard/SabbathSection";
import BirthdaySection from "../components/dashboard/BirthdaySection";

import { useAuth } from "../context/AuthContext";

import useDashboardData from "../hooks/useDashboardData";
import useUnreadMessages from "../hooks/useUnreadMessages";
import useSabbathTimer from "../hooks/useSabbathTimer";
import useBirthdays from "../hooks/useBirthdays";

import { getGreeting } from "../utils/greetings";
import { filterAnnouncements } from "../utils/announcements";

import styles from "../styles/dashboard/Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    activeChurchId,
    activeChurchName,
    isAdmin,
    canUser,
    dashboardMode,
  } = useAuth();

  const {
    loading,
    initialized,
    verse,
    announcements,
    birthday,
    todayBirthdays,
    upcomingBirthdays,
  } = useDashboardData({
    user,
    churchId: activeChurchId,
  });

  const { unreadMessages } = useUnreadMessages();

  const { isSabbath, timer: sabbathTimer } =
    useSabbathTimer();

  const {
    hasBirthday,
    isBirthday,
    birthdayTimer,
  } = useBirthdays(birthday);

  const greeting = getGreeting(user);

  const filteredAnnouncements =
    filterAnnouncements(announcements, user);

  const churchName = activeChurchName;

  const actions = [
    {
      key: "request_role",
      label: "Request Role",
      requireActiveMember: true,
      hideForAdmin: true,
    },
    {
      key: "transfer",
      label: "Membership Transfer",
      requireActiveMember: true,
    },
    {
      key: "lesson",
      label: "Lesson Subscription",
      requireActiveMember: true,
    },
  ];

  const visibleActions = actions.filter((a) => {
    if (a.hideForAdmin && isAdmin()) return false;

    return canUser(a.permission, {
      roles: a.roles,
      requireActiveMember: a.requireActiveMember,
    });
  });

  const handleAction = (type) => {
    const map = {
      request_role: () => navigate("/myrolerequest"),
      transfer: () => alert("Coming soon"),
      lesson: () => alert("Coming soon"),
    };

    map[type]?.();
  };

  if (!user) return null;

  if (loading && !initialized) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className={styles.dashboard}>

      <DashboardHeader
        churchName={churchName}
        greeting={greeting}
        verse={verse}
      />

      {(dashboardMode === "guest" ||
        dashboardMode === "requested") && (
        <MembershipSection />
      )}

      {dashboardMode === "member" && (
        <div className={styles.grid}>

          <QuickActions
            actions={visibleActions}
            isAdmin={isAdmin()}
            user={user}
            onAction={handleAction}
          />

          <AnnouncementsSection
            announcements={filteredAnnouncements}
          />

          <SabbathSection
            isSabbath={isSabbath}
            sabbathTimer={sabbathTimer}
          />

          <BirthdaySection
            user={user}
            hasBirthday={hasBirthday}
            isBirthday={isBirthday}
            birthdayTimer={birthdayTimer}
            todayBirthdays={todayBirthdays}
            upcomingBirthdays={upcomingBirthdays}
          />

        </div>
      )}

    </div>
  );
}
