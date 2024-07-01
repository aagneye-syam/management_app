import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css'; // Import the CSS file

const UserProfile = ({ user, onUpdateUsername }) => {
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername) return; // Handle empty username case
    try {
      await updateProfile(auth.currentUser, { displayName: newUsername });
      onUpdateUsername(newUsername);
      setNewUsername('');
    } catch (error) {
      console.error("Error updating username: ", error);
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="Enter new username"
        />
        <button type="submit">Update Username</button>
      </form>
      <button className="back-home-button" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default UserProfile;
