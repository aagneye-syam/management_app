// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import AuthPage from './pages/AuthPage';
import Orders from './components/Orders';
import Tasks from './components/Tasks';
import Finance from './components/Finance';
import UserProfile from './components/UserProfile'; // Import the UserProfile component

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleUpdateUsername = (newUsername) => {
    if (user) {
      setUser({ ...user, displayName: newUsername }); // Update local user state with new username
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/auth" />} />
        <Route path="/finance" element={user ? <Finance /> : <Navigate to="/auth" />} />
        <Route
          path="/"
          element={
            user ? (
              <div>
                <h1>Welcome, {user.displayName || user.email}</h1> {/* Display displayName if available */}
                <nav>
                  <ul>
                    <li><Link to="/orders">Orders</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li><Link to="/finance">Finance</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                  </ul>
                </nav>
                <button onClick={() => auth.signOut()}>Sign Out</button>
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/profile" element={<UserProfile user={user} onUpdateUsername={handleUpdateUsername} />} /> {/* Render UserProfile component */}
      </Routes>
    </Router>
  );
};

export default App;
