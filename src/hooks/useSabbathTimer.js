// hooks/useSabbathTimer.js

import { useEffect, useMemo, useState } from "react";
import {
  isSabbathNow,
  nextSabbathStart,
  timeDiff,
} from "../utils/time";

export default function useSabbathTimer() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isSabbath = useMemo(() => {
    return isSabbathNow();
  }, [now]);

  const timer = useMemo(() => {
    if (isSabbath) return null;

    return timeDiff(nextSabbathStart(), now);
  }, [isSabbath, now]);

  return {
    isSabbath,
    timer,
  };
}
