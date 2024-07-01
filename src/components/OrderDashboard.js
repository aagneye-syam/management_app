// src/components/OrderDashboard.js

import React from 'react';
import './Orders.css'; // Import the CSS file

const OrderDashboard = ({ orders, toggleForm }) => {
  return (
    <div>
      <h2>Order Dashboard</h2>
      <button className="toggle-dashboard-button" onClick={toggleForm}>
        Add New Order
      </button>
      <ul className="orders-list">
        {orders.map(order => (
          <li key={order.id}>
            <strong>Job Type:</strong> {order.jobType}<br />
            <strong>Quantity:</strong> {order.quantity}<br />
            <strong>Deadline:</strong> {order.deadline}<br />
            <strong>Materials:</strong> {order.materials}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDashboard;
