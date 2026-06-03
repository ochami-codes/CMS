// pages/Dashboard.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import MembershipSection from "../components/dashboard/MembershipSection";
import QuickActions from "../components/dashboard/QuickActions";
import AnnouncementsSection from "../components/dashboard/AnnouncementsSection";
import SabbathSection from "../components/dashboard/SabbathSection";
import BirthdaySection from "../components/dashboard/BirthdaySection";
import TransferRequestModal from "../components/members/TransferRequestModal";
import { useAuth } from "../context/AuthContext";

import useDashboardData from "../hooks/useDashboardData";
import useSabbathTimer from "../hooks/useSabbathTimer";
import useBirthdays from "../hooks/useBirthdays";

import { getGreeting } from "../utils/greetings";
import { filterAnnouncements } from "../utils/announcements";

import styles from "../styles/dashboard/Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();
   const [showTransferModal, setShowTransferModal] = useState(false);
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
    description: "Apply for a ministry role",
    color: "blue"
  },
  {
    key: "transfer",
    label: "Membership Transfer",
    description: "Move to another church",
    color: "purple"
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
  console.log("ACTION CLICKED:", type);

  const map = {
    request_role: () => navigate("/myrolerequest"),
    transfer: () => {
      console.log("OPENING TRANSFER MODAL");
      setShowTransferModal(true);
    },
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
        <>
          <div className={styles.grid}>
            <div className={styles.card}>
              <QuickActions
                actions={visibleActions}
                isAdmin={isAdmin()}
                user={user}
                onAction={handleAction}
              />
            </div>

            <div className={styles.card}>
              <AnnouncementsSection
                announcements={filteredAnnouncements}
              />
            </div>

            <div className={styles.card}>
              <SabbathSection
                isSabbath={isSabbath}
                sabbathTimer={sabbathTimer}
              />
            </div>

            <div className={styles.card}>
              <BirthdaySection
                user={user}
                hasBirthday={hasBirthday}
                isBirthday={isBirthday}
                birthdayTimer={birthdayTimer}
                todayBirthdays={todayBirthdays}
                upcomingBirthdays={upcomingBirthdays}
              />
            </div>
          </div>

          <TransferRequestModal
            isOpen={showTransferModal}
            onClose={() => setShowTransferModal(false)}
          />
        </>
      )}
    </div>
  );
}
