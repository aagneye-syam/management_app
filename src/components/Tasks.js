import React, { useState, useEffect } from 'react';
import { db } from '../firebase';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await db.collection('tasks').get();
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    await db.collection('tasks').add({ description: newTask, status: 'pending' });
    setNewTask('');
  };

  return (
    <div>
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New Task" />
      <button onClick={handleAddTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.description} - {task.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
