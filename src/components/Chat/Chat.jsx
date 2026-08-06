import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined, AttachFile, MoreVert } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import { useParams } from 'react-router-dom';
import firebase, { firestore } from '../Firebase/firebase.utils';
import { connect } from 'react-redux';
import { avatarUrl } from '../../utils/avatar';
import { formatMessageTime, formatLastSeen } from '../../utils/time';
import EmojiPicker from './EmojiPicker';

const Chat = ({ currentUser }) => {
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const endOfMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      setRoomName('');
      setMessages([]);
      return undefined;
    }

    const unsubscribeRoom = firestore
      .collection('rooms')
      .doc(roomId)
      .onSnapshot((snapshot) => setRoomName(snapshot?.data()?.name ?? ''));

    const unsubscribeMessages = firestore
      .collection('rooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    return () => {
      unsubscribeRoom();
      unsubscribeMessages();
    };
  }, [roomId]);

  // Keep the newest message in view, the way WhatsApp does.
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  // Dismiss the picker on an outside click or Escape.
  useEffect(() => {
    if (!showEmojiPicker) return undefined;

    const onPointerDown = (event) => {
      if (!emojiRef.current?.contains(event.target)) setShowEmojiPicker(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowEmojiPicker(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showEmojiPicker]);

  // Splice the emoji in at the caret rather than appending, and leave the caret
  // just after it so typing continues where you'd expect.
  const insertEmoji = (emoji) => {
    const field = inputRef.current;
    const start = field?.selectionStart ?? input.length;
    const end = field?.selectionEnd ?? input.length;

    setInput(input.slice(0, start) + emoji + input.slice(end));

    const caret = start + emoji.length;
    window.requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(caret, caret);
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || !roomId) return;

    firestore.collection('rooms').doc(roomId).collection('messages').add({
      message: trimmed,
      name: currentUser?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setInput('');
  };

  if (!roomId) {
    return (
      <div className="chat chat--empty">
        <div className="chat_intro">
          <h1>WhatsApp Web</h1>
          <p>
            Pick a chat on the left to start messaging, or use{' '}
            <strong>Add New Chat</strong> to create one.
          </p>
        </div>
      </div>
    );
  }

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={avatarUrl(roomId)} />

        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>{formatLastSeen(lastMessage?.timestamp)}</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {messages.map((message) => {
          const isOwnMessage = message.name === currentUser?.displayName;

          return (
            <div
              key={message.id}
              className={`chat_message ${isOwnMessage ? 'chat_message--own' : ''}`}
            >
              {!isOwnMessage && <span className="chat_name">{message.name}</span>}
              <span className="chat_text">{message.message}</span>
              <span className="chat_timeStamp">
                {formatMessageTime(message.timestamp)}
              </span>
            </div>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="chat_footer">
        <div className="chat_emoji" ref={emojiRef}>
          {showEmojiPicker && <EmojiPicker onSelect={insertEmoji} />}
          <IconButton
            aria-label="Choose an emoji"
            aria-expanded={showEmojiPicker}
            className={showEmojiPicker ? 'chat_emojiButton--open' : ''}
            onClick={() => setShowEmojiPicker((open) => !open)}
          >
            <InsertEmoticonIcon />
          </IconButton>
        </div>
        <form onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">Send a message</button>
        </form>
        <IconButton onClick={sendMessage} aria-label="Send message">
          {input.trim() ? <SendIcon /> : <MicIcon />}
        </IconButton>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Chat);
