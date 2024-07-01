// src/components/UserProfile.js
import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth'; // Import updateProfile from Firebase Authentication
import { auth } from '../firebase'; // Adjust the path according to your firebase setup

const UserProfile = ({ user, onUpdateUsername }) => {
  const [newUsername, setNewUsername] = useState('');

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
    <div>
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
    </div>
  );
};

export default UserProfile;
