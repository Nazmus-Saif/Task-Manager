import React, { useState } from "react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "E-Commerce Website",
      status: "Active",
      dueDate: "May 9, 2024",
      priority: "High",
    },
    {
      id: 2,
      name: "Mobile App",
      status: "Ongoing",
      dueDate: "March 30, 2024",
      priority: "Medium",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    priority: "",
    dueDate: "",
  });

  const userRole = "admin";

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { ...editingTask, ...formData };
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={userRole} />

      <main className="main-content">
        <header className="top-nav">
          <h1>Tasks</h1>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <MdSearch />
          </div>
        </header>

        <section className="task-section">
          {editingTask ? (
            <div className="edit-form-container">
              <h2>Edit Task</h2>
              <form onSubmit={handleFormSubmit} className="edit-form">
                <div className="input-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Priority:</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Due Date:</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter((task) =>
                    task.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td className={`status ${task.status.toLowerCase()}`}>
                        {task.status}
                      </td>
                      <td>{task.priority}</td>
                      <td>{task.dueDate}</td>
                      <td className="action-buttons">
                        <button
                          className="btn edit-btn"
                          onClick={() => handleEdit(task)}
                        >
                          <MdEdit /> Edit
                        </button>
                        <button
                          className="btn delete-btn"
                          onClick={() => handleDelete(task.id)}
                        >
                          <MdDelete /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </section>
  );
};

export default Tasks;
