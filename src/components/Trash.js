import React from 'react';

const Trash = ({ trashedOrders, restoreOrder, permanentlyDeleteOrder, toggleDashboard }) => {
  return (
    <div>
      <h2>Trash</h2>
      <button className="toggle-dashboard-button" onClick={toggleDashboard}>Back to Dashboard</button>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Job Type</th>
            <th>Quantity</th>
            <th>Deadline</th>
            <th>Materials</th>
            <th>Deleted At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trashedOrders.map(order => (
            <tr key={order.id}>
              <td>{order.jobType}</td>
              <td>{order.quantity}</td>
              <td>{order.deadline}</td>
              <td>{order.materials}</td>
              <td>{new Date(order.deletedAt.seconds * 1000).toLocaleString()}</td>
              <td>
                <button onClick={() => restoreOrder(order)}>Restore</button>
                <button onClick={() => permanentlyDeleteOrder(order.id)}>Delete Permanently</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trash;
