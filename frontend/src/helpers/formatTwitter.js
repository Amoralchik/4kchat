import { DateTime } from 'luxon';

export function formatTwitter(timestamp) {
  const now = DateTime.now();
  const date = DateTime.fromISO(timestamp);

  const diffInMinutes = now.diff(date, 'minutes').minutes;
  const diffInHours = now.diff(date, 'hours').hours;
  const diffInDays = now.diff(date, 'days').days;

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
  if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`;

  return date.toLocaleString(DateTime.DATE_MED); // e.g., 'Oct 22, 2024'
}
