// src/components/Orders.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './Orders.css'; // Import the CSS file

const Orders = () => {
  const [jobType, setJobType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [materials, setMaterials] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    };

    fetchOrders();
  }, [submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'orders'), {
        jobType,
        quantity,
        deadline,
        materials,
      });
      setSubmitted(true);
      setShowForm(false);
      setJobType('');
      setQuantity('');
      setDeadline('');
      setMaterials('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="orders-container">
      {showForm ? (
        <div>
          <h2>Submit a New Order</h2>
          <form className="orders-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Type</label>
              <input
                type="text"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                placeholder="Enter Job Type"
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                required
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Materials</label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="Enter Materials"
                required
              />
            </div>
            <div className="buttons-form">
              <button type="submit" className="submit-button">Submit Order</button>
              <button className="toggle-dashboard-button" onClick={toggleForm}>Show Dashboard</button>
            </div>
          </form>
          
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Orders;
