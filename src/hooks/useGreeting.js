import { useMemo } from "react";

const MORNING_GREETINGS = [
  "Good morning",
  "Rise and shine",
  "Morning",
  "Top of the morning",
];
const AFTERNOON_GREETINGS = [
  "Good afternoon",
  "Hope your day's going well",
  "Afternoon",
  "Good day",
];
const EVENING_GREETINGS = [
  "Good evening",
  "Evening",
  "Hope it's been a good day",
  "Winding down?",
];

function seededPick(arr, seed) {
  return arr[seed % arr.length];
}

export function useGreeting(firstName = "") {
  return useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const daySeed = now.getDate() + now.getMonth() * 31;

    let greeting;
    if (hour < 12) {
      greeting = seededPick(MORNING_GREETINGS, daySeed);
    } else if (hour < 17) {
      greeting = seededPick(AFTERNOON_GREETINGS, daySeed + 7);
    } else {
      greeting = seededPick(EVENING_GREETINGS, daySeed + 13);
    }

    return `${greeting}${firstName ? `, ${firstName}` : ""}`;
  }, [firstName]);
}