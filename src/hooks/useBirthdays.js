// hooks/useBirthdays.js

import { useEffect, useMemo, useState } from "react";

import {
  getNextBirthday,
  timeDiff,
} from "../utils/time";

export default function useBirthdays(birthday) {
  const [now, setNow] = useState(new Date());

  // =========================
  // LIVE CLOCK
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // HAS BIRTHDAY DATA
  // =========================
  const hasBirthday = useMemo(() => {
    return !!birthday?.birthday;
  }, [birthday]);

  // =========================
  // IS TODAY USER BIRTHDAY?
  // =========================
  const isBirthday = useMemo(() => {
    return birthday?.isBirthday || false;
  }, [birthday]);

  // =========================
  // COUNTDOWN TIMER
  // =========================
const birthdayTimer = useMemo(() => {
  if (!birthday?.birthday) return null;

  const dob = new Date(birthday.birthday.birthday);

  // invalid date guard
  if (isNaN(dob.getTime())) {
    console.error("Invalid birthday:", birthday.birthday);
    return null;
  }

  const nextBirthday = getNextBirthday(dob);

if (!nextBirthday) return null;

return timeDiff(nextBirthday, now);
