// hooks/useBirthdays.js

import { useEffect, useMemo, useState } from "react";
import { getNextBirthday, timeDiff } from "../utils/time";

export default function useBirthdays(birthday) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hasBirthday = useMemo(() =>!!birthday?.birthday, [birthday]);

  const isBirthday = useMemo(() => birthday?.isBirthday || false, [birthday]);

  const birthdayTimer = useMemo(() => {
    const dobStr = birthday?.birthday?.birthday;
    if (!dobStr) return null;

    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) {
      console.error("Invalid birthday:", dobStr);
      return null;
    }

    const nextBirthday = getNextBirthday(dob);
    if (!nextBirthday) return null;

    return timeDiff(nextBirthday, now);
  }, [birthday, now]);

  return { hasBirthday, isBirthday, birthdayTimer, fullName: birthday?.birthday?.full_name };
}
