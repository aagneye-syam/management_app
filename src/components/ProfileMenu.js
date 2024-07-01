// src/components/ProfileMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProfileMenu = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="profile-menu">
      <span className="username" onClick={() => navigate('/profile')}>
        {user.displayName || user.email}
      </span>
      <button className="sign-out-button" onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default ProfileMenu;
