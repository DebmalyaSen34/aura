import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(datestring: string) {
  const now = new Date();
  const past = new Date(datestring);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = [
    {
      label: "year",
      seconds: 31536000,
    },
    {
      label: "month",
      seconds: 2592000,
    },
    {
      label: "day",
      seconds: 86400,
    },
    {
      label: "hour",
      seconds: 3600,
    },
    {
      label: "minute",
      seconds: 60,
    },
    {
      label: "second",
      seconds: 1,
    },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function getCleanDate(datestring: string) {
  const date = new Date(datestring);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
