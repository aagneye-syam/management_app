import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, onSnapshot, updateDoc, doc, setDoc, writeBatch } from 'firebase/firestore';
import './Tasks.component.css'; // Ensure correct path to your CSS file

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customTasks, setCustomTasks] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = (order) => {
    setSelectedOrder(order);
    setCustomTasks([]);
    setTaskDescription('');
  };

  const handleTaskInputChange = (e) => {
    setTaskDescription(e.target.value);
  };

  const handleAddCustomTask = () => {
    if (taskDescription.trim() !== '') {
      setCustomTasks(prevTasks => [...prevTasks, taskDescription]);
      setTaskDescription('');
    }
  };

  const handleConfirmAddTask = async () => {
    const { id, jobType, quantity, deadline, materials, amount } = selectedOrder;

    // Initialize batch
    const batch = writeBatch(db);

    // Loop through customTasks and add each as a document to 'tasks' collection
    customTasks.forEach(description => {
      const newTaskRef = collection(db, 'tasks').doc();
      batch.set(newTaskRef, {
        description,
        status: 'pending',
        orderDetails: { jobType, quantity, deadline, materials, amount },
        options: [] // Adjust as needed
      });
    });

    try {
      // Commit the batch
      await batch.commit();

      const updatedOrders = orders.map(order => {
        if (order.id === id) {
          return {
            ...order,
            // Adjust completion percentage calculation as per your requirement
            completionPercentage: 'TODO' // Placeholder
          };
        }
        return order;
      });

      // Update orders in Firestore (if needed)

      setOrders(updatedOrders);
      setSelectedOrder(null);
      setCustomTasks([]);
    } catch (error) {
      console.error('Error committing batch:', error);
    }
  };

  return (
    <div className="tasks-container">
      <h3>Orders as Tasks</h3>
      <table className="tasks-table">
        <thead>
          <tr>
            <th>Job Type</th>
            <th>Quantity</th>
            <th>Deadline</th>
            <th>Materials</th>
            <th>Add Task</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.jobType}</td>
              <td>{order.quantity}</td>
              <td>{order.deadline}</td>
              <td>{order.materials}</td>
              <td>
                <button className="add-task-button" onClick={() => handleAddTask(order)}>Add Task</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && selectedOrder.id && (
        <div className="task-options">
          <h4>Add Custom Tasks</h4>
          <input
            type="text"
            value={taskDescription}
            onChange={handleTaskInputChange}
            placeholder="Enter task description"
          />
          <button className="add-custom-task-button" onClick={handleAddCustomTask}>Add custom Task</button>
          <ul className="custom-tasks-list">
            {customTasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
          <button className="confirm-add-task-button" onClick={handleConfirmAddTask}>Confirm Add Task</button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
