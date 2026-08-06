// Firestore timestamps arrive as null until the server write completes, so every
// helper here has to tolerate a missing value rather than build an Invalid Date.
const toDate = (timestamp) => {
  const date = timestamp?.toDate?.();
  return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
};

// 'numeric' hour drops the padding zero, so en-US reads "4:39 PM" rather than
// "04:39 PM"; 24-hour locales still render "16:39".
const timeOfDay = (date) =>
  date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Bubble timestamp: "09:28".
export const formatMessageTime = (timestamp) => {
  const date = toDate(timestamp);
  return date ? timeOfDay(date) : '';
};

// Chat list preview: time for today, "Yesterday", otherwise a short date.
export const formatChatListTime = (timestamp) => {
  const date = toDate(timestamp);
  if (!date) return '';

  const now = new Date();
  if (isSameDay(date, now)) return timeOfDay(date);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

// Chat header subtitle.
export const formatLastSeen = (timestamp) => {
  const date = toDate(timestamp);
  if (!date) return 'Tap here for contact info';

  if (isSameDay(date, new Date())) {
    return `last seen today at ${timeOfDay(date)}`;
  }

  return `last seen ${date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })} at ${timeOfDay(date)}`;
};
