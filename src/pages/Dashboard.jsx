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
import LessonGuideModal from "../components/sabbathSchool/LessonGuideModal";
import TransferRequestModal from "../components/members/TransferRequestModal";

import { useAuth } from "../context/AuthContext";
import useDashboardData from "../hooks/dashboard/useDashboardData";
import useSabbathTimer from "../hooks/useSabbathTimer";
import useBirthdays from "../hooks/useBirthdays";

import { getGreeting } from "../utils/greetings";
import { filterAnnouncements } from "../utils/announcements";

import styles from "../styles/dashboard/Dashboard.module.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [
    showTransferModal,
    setShowTransferModal,
  ] = useState(false);

  const [
    showLessonModal,
    setShowLessonModal,
  ] = useState(false);

  const {
    user,
    isAdmin,
    canUser,

    // Membership context
    activeChurch,
    activeChurchId,
    activeChurchName,
    dashboardMode,
  } = useAuth();

  if (!user) {
    return null;
  }

  /* -------------------------
     Active Church Context
  ------------------------- */

  const churchName =
    activeChurchName ??
    activeChurch?.name ??
    "Seventh-day Adventist Church";

  /* -------------------------
     Dashboard Data
  ------------------------- */

  const isMemberDashboard =
  dashboardMode === "member";

const {
  loading,
  initialized,
  verse,
  churchAnnouncements,
  departmentAnnouncements,
  birthday,
  todayBirthdays,
  upcomingBirthdays,
} = useDashboardData({
  user,
  churchId: activeChurchId,
  enabled:
    !!user &&
    !!activeChurchId &&
    isMemberDashboard,
});

  const {
    isSabbath,
    timer: sabbathTimer,
  } = useSabbathTimer();

  const {
    hasBirthday,
    isBirthday,
    birthdayTimer,
  } = useBirthdays(birthday);

  /* -------------------------
     Derived Data
  ------------------------- */

  const greeting =
    getGreeting(user);

  const filteredAnnouncements =
    filterAnnouncements(
      departmentAnnouncements,
      user
    );

  /* -------------------------
     Quick Actions
  ------------------------- */

  const actions = [
    {
      key: "request_role",
      label: "Request Role",
      description:
        "Apply for a ministry role",
      color: "blue",

      // Only active members
      requireActiveMember: true,
    },
    {
      key: "transfer",
      label:
        "Membership Transfer",
      description:
        "Move to another church",
      color: "purple",

      // Only active members
      requireActiveMember: true,
    },
    {
      key: "lesson",
      label:
        "Subscribe for Lesson",
      description:
        "Request Sabbath School guides",
      color: "blue",

      // Only active members
      requireActiveMember: true,
    },
  ];

  const visibleActions =
    actions.filter((action) => {
      if (
        action.hideForAdmin &&
        isAdmin()
      ) {
        return false;
      }

      return canUser(
        action.permission,
        {
          roles: action.roles,
          requireActiveMember:
            action.requireActiveMember,
        }
      );
    });

  /* -------------------------
     Action Handler
  ------------------------- */

  const handleAction = (type) => {
    const actionMap = {
      request_role: () =>
        navigate("/myrolerequest"),

      transfer: () =>
        setShowTransferModal(true),

      lesson: () =>
        setShowLessonModal(true),
    };

    actionMap[type]?.();
  };

  /* -------------------------
     Initial Loading
  ------------------------- */

  if (
    loading &&
    !initialized
  ) {
    return (
      <Loader
        message="Loading dashboard..."
      />
    );
  }

  return (
    <div
      className={
        styles.dashboard
      }
    >
      <DashboardHeader
        churchName={churchName}
        greeting={greeting}
        verse={verse}
      />

      {/* -------------------------
          Guest / Pending
      ------------------------- */}

      {(dashboardMode === "guest" ||
        dashboardMode ===
          "requested") && (
        <MembershipSection />
      )}

      {/* -------------------------
          Active Member
      ------------------------- */}

      {dashboardMode ===
        "member" && (
        <>
          <div
            className={
              styles.grid
            }
          >
            <div
              className={
                styles.card
              }
            >
              <QuickActions
                actions={
                  visibleActions
                }
                isAdmin={isAdmin()}
                user={user}
                onAction={
                  handleAction
                }
              />
            </div>

            <div
              className={
                styles.card
              }
            >
              <AnnouncementsSection
                churchAnnouncements={
                  churchAnnouncements
                }
                departmentAnnouncements={
                  filteredAnnouncements
                }
              />
            </div>

            <div
              className={
                styles.card
              }
            >
              <SabbathSection
                isSabbath={
                  isSabbath
                }
                sabbathTimer={
                  sabbathTimer
                }
              />
            </div>

            <div
              className={
                styles.card
              }
            >
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
            </div>
          </div>

          <TransferRequestModal
            isOpen={
              showTransferModal
            }
            onClose={() =>
              setShowTransferModal(
                false
              )
            }
          />

          <LessonGuideModal
            open={
              showLessonModal
            }
            onClose={() =>
              setShowLessonModal(
                false
              )
            }
            mode="member"
          />
        </>
      )}

      {/* -------------------------
          Suspended
      ------------------------- */}

      {dashboardMode ===
        "suspended" && (
        <MembershipSection />
      )}
    </div>
  );
}