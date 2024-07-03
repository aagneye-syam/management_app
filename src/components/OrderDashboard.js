import React from 'react';
import "./orderDashboard.component.css"
const OrderDashboard = ({ orders, toggleForm, handleEdit, handleDelete }) => {
  return (
    <div>
      <h2>Order Dashboard</h2>
      <button className="toggle-dashboard-button" onClick={toggleForm}>Back to Orders</button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Job Type</th>
            <th>Quantity</th>
            <th>Deadline</th>
            <th>Materials</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.jobType}</td>
              <td>{order.quantity}</td>
              <td>{order.deadline}</td>
              <td>{order.materials}</td>
              <td>
                <button onClick={() => handleEdit(order)}>Edit</button>
                <button onClick={() => handleDelete(order)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDashboard;
