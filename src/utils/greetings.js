// utils/greetings.js

import { isSabbathNow } from "./time";

export function getGreeting(user) {
  const name = user?.fullName || "Child of God";

  const hour = new Date().getHours();

  if (isSabbathNow()) {
    return `Happy Sabbath, ${name}!`;
  }

  if (hour < 12) {
    return `Good morning, ${name}!`;
  }

  if (hour < 18) {
    return `Good afternoon, ${name}!`;
  }

  return `Good evening, ${name}!`;
}
