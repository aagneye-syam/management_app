// src/components/UserProfile.js
import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth'; // Import updateProfile from Firebase Authentication
import { auth } from '../firebase'; // Adjust the path according to your firebase setup

const UserProfile = ({ user }) => {
  const [newUsername, setNewUsername] = useState(user.displayName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUsername) return; // Handle empty username case
    try {
      await updateProfile(auth.currentUser, { displayName: newUsername });
      alert('Username updated successfully!');
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
          className="username-input"
        />
        <button type="submit" className="update-button">Update Username</button>
      </form>
    </div>
  );
};

export default UserProfile;
