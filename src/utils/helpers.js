import { formatDistanceToNow } from "date-fns";

/**
 * Format a date string as a relative time (e.g. "3 minutes ago")
 * @param {string|Date} date
 * @returns {string}
 */
export const timeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "just now";
  }
};

/**
 * Generate a deterministic avatar background color from a string (username)
 * @param {string} str
 * @returns {string} Hex color
 */
export const stringToColor = (str = "") => {
  const colors = [
    "#4F46E5", "#7C3AED", "#DB2777", "#DC2626",
    "#D97706", "#059669", "#0891B2", "#0284C7",
    "#6D28D9", "#BE185D", "#B45309", "#047857",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Get initials from a username (up to 2 characters)
 * @param {string} username
 * @returns {string}
 */
export const getInitials = (username = "") => {
  return username.slice(0, 2).toUpperCase();
};

/**
 * Format a number with K/M abbreviations (e.g. 1200 → "1.2K")
 * @param {number} num
 * @returns {string}
 */
export const formatCount = (num = 0) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/**
 * Extract error message from axios error response
 * @param {Error} error - Axios error object
 * @param {string} fallback - Default message
 * @returns {string}
 */
export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};
