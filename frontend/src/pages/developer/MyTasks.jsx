import React, { useState } from "react";
import {
  MdCheckCircle,
  MdAccessAlarm,
  MdAutorenew,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";

const MyTasks = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Fix Login Bug",
      description:
        "Resolve the login issue preventing users from accessing their accounts.",
      status: "Pending",
      priority: "High",
      deadline: "2025-03-25",
    },
    {
      id: 2,
      name: "API Integration",
      description: "Integrate the new payment gateway API into the system.",
      status: "In Progress",
      priority: "Medium",
      deadline: "2025-03-28",
    },
  ]);

  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "",
    deadline: "",
  });

  const userPermissions = { canEdit: true, canDelete: true };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.name,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
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
      <SideBarLayout role="developer" />
      <main className="main-content">
        <header className="top-nav">
          <h1>My Tasks</h1>
        </header>

        <section className="task-section">
          {editingTask ? (
            <div className="edit-form-container">
              <h2>Edit Task</h2>
              <form onSubmit={handleFormSubmit} className="edit-form">
                <div className="input-group">
                  <label>Task Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Description:</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div className="input-group">
                  <label>Priority:</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    required
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Deadline:</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    required
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
                  <th>Task</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  {userPermissions.canEdit || userPermissions.canDelete ? (
                    <th>Actions</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.description}</td>
                    <td>{task.priority}</td>
                    <td className="action-buttons">
                      {task.status === "Pending" && (
                        <button
                          className="btn pending-btn"
                          onClick={() =>
                            handleStatusChange(task.id, "In Progress")
                          }
                        >
                          <MdAccessAlarm /> Pending
                        </button>
                      )}
                      {task.status === "In Progress" && (
                        <button
                          className="btn in-progress-btn"
                          onClick={() =>
                            handleStatusChange(task.id, "Completed")
                          }
                        >
                          <MdAutorenew /> In Progress
                        </button>
                      )}
                      {task.status === "Completed" && (
                        <button className="btn completed-btn" disabled>
                          <MdCheckCircle /> Completed
                        </button>
                      )}
                    </td>
                    <td>{task.deadline}</td>
                    {userPermissions.canEdit || userPermissions.canDelete ? (
                      <td className="action-buttons">
                        {userPermissions.canEdit && (
                          <button
                            className="btn edit-btn"
                            onClick={() => handleEditTask(task)}
                          >
                            <MdEdit /> Edit
                          </button>
                        )}
                        {userPermissions.canDelete && (
                          <button
                            className="btn delete-btn"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <MdDelete /> Delete
                          </button>
                        )}
                      </td>
                    ) : null}
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

export default MyTasks;
