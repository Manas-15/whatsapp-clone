// The legacy avatars.dicebear.com/api endpoint was retired and now returns
// nothing, which is why avatars rendered as empty grey circles. This uses the
// current DiceBear v7 host, and seeds from a stable id so a chat keeps the same
// face across renders instead of shuffling on every mount.
export const avatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed ?? 'whatsapp'
  )}`;
