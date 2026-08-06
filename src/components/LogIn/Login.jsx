import React from 'react';
import './Login.css';
import { Button } from '@material-ui/core';
import { signInWithGoogle } from '../Firebase/firebase.utils';

const Login = () => {
  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp logo"
        />
        <div className="login_text">
          <h1>Sign in to WhatsApp</h1>
          <p>Use your Google account to start messaging.</p>
        </div>

        <Button className="login_button" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
