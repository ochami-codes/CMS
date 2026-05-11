// hooks/useDashboardData.js

import { useEffect, useState } from "react";

import {
  getDailyVerse,
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
  AnnouncementsAPI,
  MembershipAPI,
} from "../utils/api";

export default function useDashboardData({
  user,
  churchId,
  isGuest,
}) {
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const [verse, setVerse] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const [birthday, setBirthday] = useState(null);
  const [todayBirthdays, setTodayBirthdays] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  const [membership, setMembership] = useState({
    status: null,
    data: null,
    hasActiveRequest: false,
  });

  useEffect(() => {
    if (!user || initialized) return;

    const cached = sessionStorage.getItem("dashboardData");

    // =========================
    // LOAD CACHE FIRST
    // =========================
    if (cached) {
      try {
        const data = JSON.parse(cached);

        setVerse(data.verse || null);
        setAnnouncements(data.announcements || []);

        setBirthday(data.birthday || null);
        setTodayBirthdays(data.todayBirthdays || []);
        setUpcomingBirthdays(data.upcomingBirthdays || []);

        setMembership({
          status: data.membership?.status || null,
          data: data.membership?.data || null,
          hasActiveRequest:
            data.membership?.hasActiveRequest || false,
        });

        setLoading(false);
        setInitialized(true);

      } catch (err) {
        console.error("Failed to parse dashboard cache:", err);
      }
    }

    // =========================
    // FETCH FRESH DATA
    // =========================
    const fetchDashboardData = async () => {
      try {
        const [
          dailyVerse,
          anns,
          myBirthday,
          todays,
          upcoming,
          membershipRes,
        ] = await Promise.all([
          getDailyVerse(),

          AnnouncementsAPI.fetch(churchId, 10),

          !isGuest ? getMyBirthday() : null,

          !isGuest
            ? getTodaysBirthdays(churchId)
            : [],

          !isGuest
            ? getUpcomingBirthdays(churchId, 30)
            : [],

          isGuest
            ? MembershipAPI.myRequests()
            : null,
        ]);

        const dashboardData = {
          verse: dailyVerse || null,

          announcements: anns || [],

          birthday: myBirthday || null,

          todayBirthdays: todays || [],

          upcomingBirthdays: upcoming || [],

          membership: {
            status:
              membershipRes?.membership_status || null,

            data:
              membershipRes?.membership || null,

            hasActiveRequest:
              membershipRes?.has_active_request || false,
          },
        };

        // =========================
        // UPDATE STATE
        // =========================
        setVerse(dashboardData.verse);

        setAnnouncements(
          dashboardData.announcements
        );

        setBirthday(dashboardData.birthday);

        setTodayBirthdays(
          dashboardData.todayBirthdays
        );

        setUpcomingBirthdays(
          dashboardData.upcomingBirthdays
        );

        setMembership(
          dashboardData.membership
        );

        // =========================
        // CACHE DATA
        // =========================
        sessionStorage.setItem(
          "dashboardData",
          JSON.stringify(dashboardData)
        );

      } catch (err) {
        console.error(
          "Dashboard fetch failed:",
          err
        );
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    fetchDashboardData();

  }, [user, churchId, isGuest, initialized]);

  return {
    loading,
    initialized,

    verse,
    announcements,

    birthday,
    todayBirthdays,
    upcomingBirthdays,

    membership,
  };
}
