import React from 'react';
import './Orders.css'; // Import the CSS file

const OrderDashboard = ({ orders, toggleForm }) => {
  // Function to sort orders by deadline
  const sortedOrders = orders.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div>
      <h2>Order Dashboard</h2>
      <button className="toggle-dashboard-button" onClick={toggleForm}>
        Add New Order
      </button>
      <ul className="orders-list">
        {sortedOrders.map(order => (
          <li key={order.id}>
            <div className="order-info">
              <div>
                <strong>Job Type:</strong> {order.jobType}<br />
                <strong>Quantity:</strong> {order.quantity}<br />
                <strong>Materials:</strong> {order.materials}
              </div>
              <div className="order-deadline">
                <strong>Deadline:</strong> {order.deadline}<br />
                <span className={`order-status ${order.completed ? 'completed' : 'pending'}`}>
                  {order.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDashboard;
