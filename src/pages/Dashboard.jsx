// pages/Dashboard.jsx

import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MembershipSection from "../components/dashboard/MembershipSection";
import QuickActions from "../components/dashboard/QuickActions";
import ToolsSection from "../components/dashboard/ToolsSection";
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

import "../styles/pages.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    user,
    activeChurch,
    activeChurchId,

    isAdmin,
    canUser,
    isGuest,
  } = useAuth();

  // =========================
  // DASHBOARD DATA
  // =========================

  const {
    loading,
    initialized,

    verse,
    announcements,

    birthday,
    todayBirthdays,
    upcomingBirthdays,

    membership,
  } = useDashboardData({
    user,
    churchId: activeChurchId,
    isGuest,
  });

  // =========================
  // UNREAD MESSAGES
  // =========================

  const {
    unreadMessages,
  } = useUnreadMessages();

  // =========================
  // SABBATH TIMER
  // =========================

  const {
    isSabbath,
    timer: sabbathTimer,
  } = useSabbathTimer();

  // =========================
  // BIRTHDAY TIMER
  // =========================

  const {
    hasBirthday,
    isBirthday,
    birthdayTimer,
  } = useBirthdays(birthday);

  // =========================
  // DERIVED UI DATA
  // =========================

  const greeting =
    getGreeting(user);

  const filteredAnnouncements =
    filterAnnouncements(
      announcements,
      user
    );

  const churchName =
    activeChurch?.name ||
    "Your Church";

  // =========================
  // QUICK ACTIONS
  // =========================

const actions = [
  {
    key: "message",
    label: "Messages",
  },

  {
    key: "request_role",
    label: "Request Role",
    permission: "role.request",
  },

  {
    key: "transfer",
    label: "Membership Transfer",
    permission:
      "membership.transfer",
    requireActiveMember: true,
  },

  {
    key: "lesson",
    label: "Lesson Subscription",
    permission:
      "lesson.subscribe",
    requireActiveMember: true,
  },
];

  // =========================
  // ACTION HANDLER
  // =========================

  const handleAction = async (
    type
  ) => {
    switch (type) {
      case "request_role":
  navigate("/myrolerequest");
  break;

        navigate("/myrolerequest");
        break;

      case "transfer":
        alert("Request transfer");
        break;

      case "lesson":
        alert("Subscribe lesson");
        break;

      case "message":
        navigate(
          "/dashboard/messages"
        );
        break;

      default:
        break;
    }
  };

  // =========================
  // LOADING
  // =========================

  if (!user) return null;

  if (loading && !initialized) {
    return (
      <Loader message="Loading dashboard..." />
    );
  }
const visibleActions = actions.filter((action) =>
  canUser(action.permission, {
    roles: action.roles,
    requireActiveMember: action.requireActiveMember,
  })
);
  // =========================
  // UI
  // =========================

  return (
    <div className="dashboard-content">

      {/* HEADER */}

      <DashboardHeader
        churchName={churchName}
        greeting={greeting}
        verse={verse}
      />

      {/* GUEST VIEW */}

      {isGuest ? (
        <MembershipSection
          membership={membership}
        />
      ) : (
        <>

          {/* QUICK ACTIONS */}

  <QuickActions
  actions={visibleActions}
  unreadMessages={unreadMessages}
  isAdmin={isAdmin()}
  user={user}
  onAction={handleAction}
/>

          {/* TOOLS */}

          <ToolsSection
            canUser={canUser}
          />

          {/* ANNOUNCEMENTS */}

          <AnnouncementsSection
            announcements={
              filteredAnnouncements
            }
          />

          {/* SABBATH */}

          <SabbathSection
            isSabbath={isSabbath}
            sabbathTimer={
              sabbathTimer
            }
          />

          {/* BIRTHDAYS */}

          <BirthdaySection
            user={user}
            hasBirthday={
              hasBirthday
            }
            isBirthday={
              isBirthday
            }
            birthdayTimer={
              birthdayTimer
            }
            todayBirthdays={
              todayBirthdays
            }
            upcomingBirthdays={
              upcomingBirthdays
            }
          />

        </>
      )}

    </div>
  );
}
