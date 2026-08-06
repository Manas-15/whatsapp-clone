import React, { useState, useEffect } from 'react';
import './sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SignoutDropdown from '../SignOut-Dropdown/signout-dropdown';
import SidebarChat from './Sidebarchat/SidebarChat';
import { firestore } from '../Firebase/firebase.utils';
import { connect } from 'react-redux';
import ProfileDetail from '../Profile-detail/profile-detail';

const Sidebar = ({ currentUser }) => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = firestore.collection('rooms').onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const query = search.trim().toLowerCase();
  const visibleRooms = query
    ? rooms.filter((room) => room.data.name?.toLowerCase().includes(query))
    : rooms;

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar
          src={currentUser?.photoURL}
          alt={currentUser?.displayName}
          onClick={() => setShowProfile(true)}
        />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={() => setShowMenu((open) => !open)}>
            <MoreVertIcon />
          </IconButton>
        </div>
        {showMenu && <SignoutDropdown onClose={() => setShowMenu(false)} />}
      </div>

      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchOutlined />
          <input
            placeholder="Search or start new chat"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {visibleRooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
        {query && !visibleRooms.length && (
          <p className="sidebar_empty">No chats found for “{search}”</p>
        )}
      </div>

      {showProfile && <ProfileDetail onClose={() => setShowProfile(false)} />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(Sidebar);
