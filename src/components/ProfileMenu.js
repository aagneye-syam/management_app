// src/components/ProfileMenu.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProfileMenu = ({ user }) => {
  return (
    <div className="profile-menu">
      <Link to="/profile" className="username">
        {user.displayName || user.email}
      </Link>
    </div>
  );
};

export default ProfileMenu;
