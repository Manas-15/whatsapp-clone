import React from 'react';
import './profile-detail.css';
import { connect } from 'react-redux';
import { Avatar, IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const ProfileDetail = ({ currentUser, onClose }) => {
  return (
    <div className="profile">
      <div className="profile_header">
        {onClose && (
          <IconButton onClick={onClose} aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
        )}
        <h3>Profile</h3>
      </div>

      <div className="profile_body">
        <div className="profile_image">
          <Avatar src={currentUser?.photoURL} alt={currentUser?.displayName} />
        </div>

        <div className="profile_field">
          <h5>Your Name</h5>
          <div className="profile_value">{currentUser?.displayName}</div>
          <p>
            This is not your username or pin. This name will be visible to your
            WhatsApp contacts.
          </p>
        </div>

        <div className="profile_field">
          <h5>Your Email</h5>
          <div className="profile_value">{currentUser?.email}</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(ProfileDetail);
