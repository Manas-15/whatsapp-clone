import React, { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Avatar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { firestore } from '../../Firebase/firebase.utils';
import { Link, useLocation } from 'react-router-dom';
import { avatarUrl } from '../../../utils/avatar';
import { formatChatListTime } from '../../../utils/time';

function SidebarChat({ addNewChat, id, name }) {
  const [messages, setMessages] = useState([]);
  // Sidebar renders outside the <Switch>, so useParams() would never see
  // :roomId — read the active room from the location instead.
  const { pathname } = useLocation();

  useEffect(() => {
    if (!id) return undefined;

    // This effect previously had no dependency array, so it re-subscribed to
    // Firestore on every single render.
    const unsubscribe = firestore
      .collection('rooms')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));

    return () => {
      unsubscribe();
    };
  }, [id]);

  const createChat = () => {
    const roomName = prompt('Please enter name for chat');

    if (roomName) {
      firestore.collection('rooms').add({
        name: roomName,
      });
    }
  };

  if (addNewChat) {
    return (
      <div onClick={createChat} className="sidebarChat sidebarChat--new">
        <AddIcon />
        <h2>Add New Chat</h2>
      </div>
    );
  }

  const latestMessage = messages[0];

  return (
    <Link className="sidebarChat_link" to={`/rooms/${id}`}>
      <div
        className={`sidebarChat ${
          pathname === `/rooms/${id}` ? 'sidebarChat--active' : ''
        }`}
      >
        <Avatar src={avatarUrl(id)} alt={name} />
        <div className="sidebarChat_info">
          <div className="sidebarChat_topRow">
            <h2>{name}</h2>
            <span className="sidebarChat_time">
              {formatChatListTime(latestMessage?.timestamp)}
            </span>
          </div>
          <p>{latestMessage?.message ?? 'No messages yet'}</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
