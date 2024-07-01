import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const Finance = () => {
  const [financeDetails, setFinanceDetails] = useState([]);

  useEffect(() => {
    const fetchFinanceDetails = async () => {
      const financeSnapshot = await db.collection('finance').get();
      const financeData = financeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFinanceDetails(financeData);
    };

    fetchFinanceDetails();
  }, []);

  return (
    <div>
      <h2>Finance Details</h2>
      <ul>
        {financeDetails.map(detail => (
          <li key={detail.id}>
            Order ID: {detail.orderId}<br />
            Amount: ${detail.amount}<br />
            Status: {detail.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Finance;
