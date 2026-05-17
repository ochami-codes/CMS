// ./src/utils/time.js
// Dashboard functions
export const getNextBirthday = (dob) => {
  if (!(dob instanceof Date) || isNaN(dob)) {
    return null;
  }

  const today = new Date();

  let next = new Date(
    today.getFullYear(),
    dob.getMonth(),
    dob.getDate()
  );

  if (next < today) {
    next.setFullYear(today.getFullYear() + 1);
  }

  return next;
};

export const isSabbathNow = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return (day === 5 && hour >= 18) || (day === 6 && hour < 18);
};

export const nextSabbathStart = () => {
  const now = new Date();
  const start = new Date(now);
  const day = now.getDay();
  const hour = now.getHours();

  if (day < 5) start.setDate(now.getDate() + (5 - day));
  else if (!(day === 5 && hour < 18))
    start.setDate(now.getDate() + (12 - day));

  start.setHours(18, 0, 0, 0);
  return start;
};

export const timeDiff = (target, now) => {
  const diff = target - now;
  if (diff <= 0) return null;

  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor(diff / (1000 * 60 * 60)) % 24,
    m: Math.floor(diff / (1000 * 60)) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
};
