// src/components/Orders.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await db.collection('orders').get();
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    };
    fetchOrders();
  }, []);

  const handleAddOrder = async () => {
    await db.collection('orders').add({ description: newOrder, status: 'pending' });
    setNewOrder('');
  };

  return (
    <div>
      <input type="text" value={newOrder} onChange={(e) => setNewOrder(e.target.value)} placeholder="New Order" />
      <button onClick={handleAddOrder}>Add Order</button>
      <ul>
        {orders.map(order => (
          <li key={order.id}>{order.description} - {order.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
