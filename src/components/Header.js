import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS for styling

const Header = ({ user }) => {
  const renderProfileButton = () => {
    if (user && user.photoURL) {
      return (
        <Link to="/userprofile" className="profile-link">
          <img src={user.photoURL} alt="Profile" className="profile-image" />
        </Link>
      );
    } else {
      return (
        <Link to="/userprofile" className="profile-link">
          <div className="default-profile">U</div>
        </Link>
      );
    }
  };

  return (
    <header className="app-header">
      <Link to="/" className="logo-link">
        <h1 className="logo-text">Offset Printing Press</h1>
      </Link>
      <nav>
        <ul className="nav-links">
          <li><Link to="/orders">Orders</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/finance">Finance</Link></li>
        </ul>
      </nav>
      <div className="profile-button">
        {renderProfileButton()}
      </div>
    </header>
  );
};

export default Header;
