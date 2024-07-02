import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Finance = () => {
  const [financeDetails, setFinanceDetails] = useState([]);

  useEffect(() => {
    const fetchFinanceDetails = async () => {
      const financeSnapshot = await getDocs(collection(db, 'finance'));
      const financeData = financeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFinanceDetails(financeData);
    };

    fetchFinanceDetails();
  }, []);

  const getTotalProfits = () => {
    return financeDetails.reduce((total, detail) => total + parseFloat(detail.amount), 0);
  };

  const barChartData = {
    labels: financeDetails.map(detail => `Order ID: ${detail.orderId}`),
    datasets: [
      {
        label: 'Amount',
        data: financeDetails.map(detail => parseFloat(detail.amount)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: financeDetails.map(detail => `Order ID: ${detail.orderId}`),
    datasets: [
      {
        label: 'Amount',
        data: financeDetails.map(detail => parseFloat(detail.amount)),
        backgroundColor: financeDetails.map((_, index) => `hsl(${index * 36}, 70%, 50%)`),
      },
    ],
  };

  return (
    <div>
      <h2>Finance Details</h2>
      <p>Total Profits Earned: ${getTotalProfits().toFixed(2)}</p>
      <div>
        <h3>Bar Chart</h3>
        <Bar data={barChartData} />
      </div>
      <div>
        <h3>Pie Chart</h3>
        <Pie data={pieChartData} />
      </div>
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
