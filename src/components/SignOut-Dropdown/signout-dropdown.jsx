import React from 'react';
import './signout-dropdown.css';
import { auth } from '../Firebase/firebase.utils';

const SignoutDropdown = ({ onClose }) => {
  return (
    <>
      {/* Click anywhere else to dismiss the menu. */}
      <div className="dropdown_backdrop" onClick={onClose} />
      <div className="dropdown">
        <button
          type="button"
          className="dropdown_item"
          onClick={() => {
            onClose?.();
            auth.signOut();
          }}
        >
          Log out
        </button>
      </div>
    </>
  );
};

export default SignoutDropdown;
