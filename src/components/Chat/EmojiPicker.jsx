import React, { useState } from 'react';
import './EmojiPicker.css';

// Kept as plain data rather than pulling in an emoji-picker dependency: the
// current published pickers require React 18 and this app is on React 17.
const CATEGORIES = [
  {
    id: 'smileys',
    label: 'Smileys & people',
    icon: '😀',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
      '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
      '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
      '😝', '🤗', '🤭', '🤫', '🤔', '😐', '😑', '😶',
      '😏', '😒', '🙄', '😬', '😌', '😔', '😪', '🤤',
      '😴', '😷', '🤒', '🤕', '🥵', '🥶', '😵', '🤯',
      '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮',
      '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰',
      '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
      '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈',
    ],
  },
  {
    id: 'gestures',
    label: 'Gestures',
    icon: '👍',
    emojis: [
      '👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘',
      '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚',
      '🖐️', '🖖', '👋', '🤝', '🙏', '✍️', '💪', '🦾',
      '👏', '🙌', '👐', '🤲', '🫶', '💅', '🤳', '🫡',
      '🧠', '👀', '👁️', '👄', '🦷', '👶', '🧒', '👦',
      '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '🙋',
    ],
  },
  {
    id: 'hearts',
    label: 'Hearts',
    icon: '❤️',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
      '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
      '💘', '💝', '💟', '♥️', '💌', '😻', '🥰', '😍',
    ],
  },
  {
    id: 'animals',
    label: 'Animals & nature',
    icon: '🐶',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
      '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
      '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅',
      '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛',
      '🦋', '🐌', '🐞', '🐜', '🕷️', '🐢', '🐍', '🦎',
      '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬',
      '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍',
      '🌸', '🌹', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳',
      '🍀', '🍁', '🍂', '🌊', '🌈', '☀️', '🌙', '⭐',
    ],
  },
  {
    id: 'food',
    label: 'Food & drink',
    icon: '🍕',
    emojis: [
      '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇',
      '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥',
      '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🥒', '🥬',
      '🍞', '🥐', '🥖', '🧀', '🥚', '🍳', '🥞', '🧇',
      '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯',
      '🥗', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🍚',
      '🍰', '🎂', '🧁', '🍦', '🍩', '🍪', '🍫', '🍬',
      '☕', '🍵', '🥤', '🍺', '🍻', '🥂', '🍷', '🥃',
    ],
  },
  {
    id: 'activities',
    label: 'Activities & travel',
    icon: '⚽',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
      '🎱', '🏓', '🏸', '🥊', '🥋', '⛳', '🏹', '🎣',
      '🏊', '🏄', '🚴', '🏃', '🧘', '🏋️', '🚗', '🚕',
      '🚌', '🏎️', '🚓', '🚑', '🚒', '🚲', '🛵', '🏍️',
      '✈️', '🚀', '🛸', '🚁', '⛵', '🚢', '🗺️', '🏝️',
      '🏔️', '🎡', '🎢', '🎪', '🎬', '🎤', '🎧', '🎸',
      '🎹', '🥁', '🎺', '🎲', '🎯', '🎮', '🏆', '🥇',
    ],
  },
  {
    id: 'objects',
    label: 'Objects',
    icon: '💡',
    emojis: [
      '💡', '🔑', '🔒', '🔓', '🔨', '🪛', '🔧', '⚙️',
      '🧰', '🧲', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📱',
      '☎️', '📞', '📟', '📠', '🔋', '🔌', '💾', '💿',
      '📀', '📷', '📹', '🎥', '📺', '📻', '⏰', '⏳',
      '📚', '📖', '📝', '✏️', '📌', '📎', '📁', '📂',
      '📅', '📊', '📈', '📉', '💰', '💳', '💎', '🎁',
      '🎈', '🎉', '🎊', '🕯️', '🧻', '🧼', '🛒', '📦',
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    icon: '✅',
    emojis: [
      '✅', '❌', '❎', '✔️', '➕', '➖', '➗', '✖️',
      '❓', '❔', '❗', '❕', '‼️', '⁉️', '💯', '🔥',
      '✨', '⚡', '💥', '💫', '💦', '💨', '🕐', '🔔',
      '🔕', '🎵', '🎶', '⚠️', '🚫', '♻️', '🔰', '⭕',
      '🆗', '🆒', '🆕', '🆓', '🔝', '🔙', '🔜', '🔛',
      '⬆️', '⬇️', '⬅️', '➡️', '↩️', '↪️', '🔄', '🔃',
    ],
  },
];

const EmojiPicker = ({ onSelect }) => {
  const [activeId, setActiveId] = useState(CATEGORIES[0].id);
  const active = CATEGORIES.find((c) => c.id === activeId) ?? CATEGORIES[0];

  return (
    <div className="emojiPicker" role="dialog" aria-label="Choose an emoji">
      <div className="emojiPicker_tabs" role="tablist">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={category.id === activeId}
            title={category.label}
            className={`emojiPicker_tab ${
              category.id === activeId ? 'emojiPicker_tab--active' : ''
            }`}
            onClick={() => setActiveId(category.id)}
          >
            {category.icon}
          </button>
        ))}
      </div>

      <p className="emojiPicker_label">{active.label}</p>

      <div className="emojiPicker_grid">
        {active.emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emojiPicker_emoji"
            aria-label={emoji}
            // onMouseDown, not onClick: it fires before the input loses focus,
            // so the caret position is still readable when we insert.
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(emoji);
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
