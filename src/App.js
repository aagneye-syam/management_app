import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import AuthPage from './pages/AuthPage';
import Orders from './components/Orders';
import Tasks from './components/Tasks';
import Finance from './components/Finance';

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
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/auth" />} />
        <Route path="/finance" element={user ? <Finance /> : <Navigate to="/auth" />} />
        <Route path="/" element={
          user ? (
            <div>
              <h1>Welcome, {user.email}</h1>
              <nav>
                <ul>
                  <li><Link to="/orders">Orders</Link></li>
                  <li><Link to="/tasks">Tasks</Link></li>
                  <li><Link to="/finance">Finance</Link></li>
                </ul>
              </nav>
              <button onClick={() => auth.signOut()}>Sign Out</button>
            </div>
          ) : (
            <Navigate to="/auth" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
