// src/App.js
import React from 'react';
import Auth from './components/Auth';
import Orders from './components/Orders';
import Tasks from './components/Tasks';
import Finance from './components/Finance';

const App = () => {
  return (
    <div>
      <h1>Printing Press Management</h1>
      <Auth />
      <Orders />
      <Tasks />
      <Finance />
    </div>
  );
};

export default App;
