import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Orders.css'; // Import the CSS file
import OrderDashboard from './OrderDashboard'; // Import the OrderDashboard component

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
        completed: false // Default completed status
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

  const handleEdit = async (orderId) => {
    const orderRef = doc(db, 'orders', orderId);
    try {
      await updateDoc(orderRef, {
        jobType,
        quantity,
        deadline,
        materials
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
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
        <OrderDashboard orders={orders} toggleForm={toggleForm} handleEdit={handleEdit} />
      )}
    </div>
  );
};

export default Orders;
