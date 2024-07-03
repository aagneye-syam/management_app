import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Finance = () => {
  const [financeDetails, setFinanceDetails] = useState([]);
  const [xAxisOption, setXAxisOption] = useState('orderName');
  const [yAxisOption, setYAxisOption] = useState('amount');

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

  const lineChartData = {
    labels: financeDetails.map(detail => detail[xAxisOption]),
    datasets: [
      {
        label: 'Amount',
        data: financeDetails.map(detail => parseFloat(detail[yAxisOption])),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const pieChartData = {
    labels: financeDetails.map(detail => detail.orderName),
    datasets: [
      {
        label: 'Amount',
        data: financeDetails.map(detail => parseFloat(detail.amount)),
        backgroundColor: financeDetails.map((_, index) => `hsl(${index * 36}, 70%, 50%)`),
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.5,
  };

  const pieChartStyle = {
    width: '50%',
    height: '400px',
    margin: '0 auto',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Finance Details</h2>
      <p>Total Profits Earned: ${getTotalProfits().toFixed(2)}</p>
      <div>
        <h3>Line Graph</h3>
        <div>
          <label>X-Axis:</label>
          <select onChange={e => setXAxisOption(e.target.value)} value={xAxisOption}>
            <option value="orderName">Order Name</option>
            <option value="orderId">Order ID</option>
          </select>
          <label>Y-Axis:</label>
          <select onChange={e => setYAxisOption(e.target.value)} value={yAxisOption}>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
        </div>
        <Line data={lineChartData} />
      </div>
      <div style={pieChartStyle}>
        <h3>Pie Chart</h3>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
      <ul>
        {financeDetails.map(detail => (
          <li key={detail.id}>
            Order Name: {detail.orderName}<br />
            Amount: ${detail.amount}<br />
            Status: {detail.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Finance;
