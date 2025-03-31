import { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });

  useEffect(() => {
    axios.get("http://localhost:5000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = () => {
    axios.post("http://localhost:5000/tasks", newTask)
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error("Error adding task:", error));
  };

  const updateTask = (id, updatedTask) => {
    axios.put(`http://localhost:5000/tasks/${id}`, updatedTask)
      .then(response => setTasks(tasks.map(task => task.id === id ? response.data : task)))
      .catch(error => console.error("Error updating task:", error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error("Error deleting task:", error));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Task Manager</h1>
      <input className="border p-2 mb-2 w-full" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
      <input className="border p-2 mb-2 w-full" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
      <button className="bg-blue-500 text-white p-2 w-full" onClick={addTask}>Add Task</button>
      <ul className="mt-4">
        {tasks.map(task => (
          <li key={task.id} className="border p-2 mb-2 flex justify-between">
            <div>
              <h2 className="font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <small>{task.status}</small>
            </div>
            <div>
              <button className="bg-yellow-500 text-white p-1 mr-2" onClick={() => updateTask(task.id, {...task, status: task.status === "pending" ? "completed" : "pending"})}>Toggle Status</button>
              <button className="bg-red-500 text-white p-1" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
