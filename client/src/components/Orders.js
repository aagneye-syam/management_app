import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, onSnapshot } from 'firebase/firestore';
import './Orders.css';
import OrderDashboard from './OrderDashboard';

const Orders = () => {
  const [jobType, setJobType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deadline, setDeadline] = useState('');
  const [materials, setMaterials] = useState('');
  const [amount, setAmount] = useState('');
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingOrder) {
      await handleEditSubmit();
    } else {
      await handleNewOrderSubmit();
    }
  };

  const handleNewOrderSubmit = async () => {
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        jobType,
        quantity,
        deadline,
        materials,
        amount,
        completed: false
      });

      await addDoc(collection(db, 'finance'), {
        orderId: orderRef.id,
        jobType,
        amount
      });

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleEditSubmit = async () => {
    const orderRef = doc(db, 'orders', editingOrder.id);
    try {
      await updateDoc(orderRef, {
        jobType,
        quantity,
        deadline,
        materials,
        amount
      });

      const financeQuerySnapshot = await getDocs(query(collection(db, 'finance'), where('orderId', '==', editingOrder.id)));
      if (!financeQuerySnapshot.empty) {
        const financeDoc = financeQuerySnapshot.docs[0];
        const financeRef = doc(db, 'finance', financeDoc.id);
        await updateDoc(financeRef, {
          jobType,
          amount
        });
      }

      setShowForm(false);
      resetForm();
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleDelete = async (order) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this order?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'orders', order.id));

        const financeQuerySnapshot = await getDocs(query(collection(db, 'finance'), where('orderId', '==', order.id)));
        if (!financeQuerySnapshot.empty) {
          const financeDoc = financeQuerySnapshot.docs[0];
          await deleteDoc(doc(db, 'finance', financeDoc.id));
        }
      } catch (error) {
        console.error('Error deleting document: ', error);
      }
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const resetForm = () => {
    setJobType('');
    setQuantity('');
    setDeadline('');
    setMaterials('');
    setAmount('');
  };

  const handleEditClick = (order) => {
    setJobType(order.jobType);
    setQuantity(order.quantity);
    setDeadline(order.deadline);
    setMaterials(order.materials);
    setAmount(order.amount);
    setEditingOrder(order);
    setShowForm(true);
  };

  return (
    <div className="orders-container">
      {showForm ? (
        <div>
          <h2>{editingOrder ? 'Edit Order' : 'Submit a New Order'}</h2>
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
              <button type="submit" className="submit-button">
                {editingOrder ? 'Update Order' : 'Submit Order'}
              </button>
              <button type="button" className="toggle-dashboard-button" onClick={toggleForm}>
                Show Dashboard
              </button>
            </div>
          </form>
        </div>
      ) : (
        <OrderDashboard
          orders={orders}
          toggleForm={toggleForm}
          handleEdit={handleEditClick}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Orders;
