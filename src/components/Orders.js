// src/components/Orders.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import your Firebase database configuration
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Import Firestore functions

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

  return (
    <div>
      {showForm ? (
        <div>
          <h2>Submit a New Order</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              placeholder="Job Type"
              required
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
              required
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline"
              required
            />
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Materials"
              required
            />
            <button type="submit">Submit Order</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Order Dashboard</h2>
          <button onClick={() => setShowForm(true)}>Add New Order</button>
          <ul>
            {orders.map(order => (
              <li key={order.id}>
                <strong>Job Type:</strong> {order.jobType}, <strong>Quantity:</strong> {order.quantity}, <strong>Deadline:</strong> {order.deadline}, <strong>Materials:</strong> {order.materials}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Orders;
