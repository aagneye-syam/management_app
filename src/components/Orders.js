import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import './Orders.css'; // Import the combined CSS file
import OrderDashboard from './OrderDashboard'; // Import the OrderDashboard component

const Orders = () => {
  const [jobType, setJobType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [materials, setMaterials] = useState('');
  const [amount, setAmount] = useState(''); // New state for order amount
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
      const orderRef = await addDoc(collection(db, 'orders'), {
        jobType,
        quantity,
        deadline,
        materials,
        amount, // Include the amount in the order document
        completed: false // Default completed status
      });

      // Add finance detail associated with the order
      await addDoc(collection(db, 'finance'), {
        orderId: orderRef.id,
        jobType,
        amount
      });

      setSubmitted(true);
      setShowForm(false);
      setJobType('');
      setQuantity('');
      setDeadline('');
      setMaterials('');
      setAmount(''); // Reset amount
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
        materials,
        amount // Include the amount in the update
      });

      // Update finance detail associated with the order
      const financeQuerySnapshot = await getDocs(collection(db, 'finance'));
      const financeDocs = financeQuerySnapshot.docs;
      const financeDoc = financeDocs.find(doc => doc.data().orderId === orderId);
      
      if (financeDoc) {
        const financeRef = doc(db, 'finance', financeDoc.id);
        await updateDoc(financeRef, {
          jobType,
          amount
        });
      }

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
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                required
              />
            </div>
            <div className="buttons-form">
              <button type="submit" className="submit-button">Submit Order</button>
              <button type="button" className="toggle-dashboard-button" onClick={toggleForm}>Show Dashboard</button>
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
