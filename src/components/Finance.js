import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const Finance = () => {
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ type: 'income', amount: '', description: '' });

  useEffect(() => {
    const fetchRecords = async () => {
      const snapshot = await db.collection('financial_records').get();
      const recordsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(recordsData);
    };
    fetchRecords();
  }, []);

  const handleAddRecord = async () => {
    await db.collection('financial_records').add(newRecord);
    setNewRecord({ type: 'income', amount: '', description: '' });
  };

  return (
    <div>
      <select value={newRecord.type} onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <input type="number" value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} placeholder="Amount" />
      <input type="text" value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })} placeholder="Description" />
      <button onClick={handleAddRecord}>Add Record</button>
      <ul>
        {records.map(record => (
          <li key={record.id}>{record.type} - ${record.amount} - {record.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default Finance;
