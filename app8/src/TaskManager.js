// src/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
  .then((response) => setTasks(response.data))
  .catch((error) => {
    if (!error.response) {
      // Network error occurred
      console.error('Network error: Unable to reach the server.');
    } else {
      // Server responded with a status code outside the 2xx range
      console.error(`Server error: ${error.response.status}`);
    }
  });


  }, []);

  const handleAddTask = () => {
    axios.post('http://localhost:5000/tasks', newTask)
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', status: 'pending' });
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleUpdateTask = () => {
    axios.put(`http://localhost:5000/tasks/${editingTask.id}`, editingTask)
      .then((response) => {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id ? response.data : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {editingTask && (
        <div>
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
          />
          <input
            type="text"
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
          />
          <select
            value={editingTask.status}
            onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button onClick={handleUpdateTask}>Update Task</button>
        </div>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => setEditingTask(task)}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;