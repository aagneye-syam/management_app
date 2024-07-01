// src/components/ProfileMenu.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileMenu = ({ user }) => {
  return (
    <div className="profile-menu">
      <Link to="/profile" className="username-link">
        <span className="username">{user.displayName || user.email}</span>
      </Link>
    </div>
  );
};

export default ProfileMenu;
