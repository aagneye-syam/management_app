// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import AuthPage from './pages/AuthPage';
import Orders from './components/Orders';
import Tasks from './components/Tasks';
import Finance from './components/Finance';
import ProfileMenu from './components/ProfileMenu';

import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Offset Printing Press</h1>
          {user && <ProfileMenu user={user} />}
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
            <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" />} />
            <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/auth" />} />
            <Route path="/finance" element={user ? <Finance /> : <Navigate to="/auth" />} />
            <Route
              path="/"
              element={
                user ? (
                  <div className="welcome-container">
                    <h2>Welcome, {user.displayName || user.email}</h2>
                    <nav className="app-nav">
                      <ul>
                        <li><Link to="/orders">Orders</Link></li>
                        <li><Link to="/tasks">Tasks</Link></li>
                        <li><Link to="/finance">Finance</Link></li>
                      </ul>
                    </nav>
                    <button className="sign-out-button" onClick={() => auth.signOut()}>Sign Out</button>
                  </div>
                ) : (
                  <Navigate to="/auth" />
                )
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; 2024 Offset Printing Press. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
