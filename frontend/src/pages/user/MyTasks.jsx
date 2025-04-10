import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { MdSearch, MdEdit, MdDelete } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authController } from "../../controllers/authController.js";

const MyTasks = () => {
  const {
    authorizedUser,
    getTasks,
    tasks,
    isTaskFetching,
    updateTask,
    deleteTask,
  } = authController();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    priority: "",
    dueDate: "",
    assignedBy: "",
  });

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      name: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.deadline,
      assignedBy: task.assigned_by,
    });
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    authController.setState((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      ...editingTask,
      title: formData.name,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.dueDate,
      assigned_by: formData.assignedBy,
    };

    const validFields = {
      title: updatedTask.title,
      status: updatedTask.status,
      priority: updatedTask.priority,
      deadline: updatedTask.deadline,
      assigned_by: updatedTask.assigned_by,
    };

    await updateTask(updatedTask.id, validFields);

    authController.setState((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === updatedTask.id ? { ...task, ...validFields } : task
      ),
    }));

    setEditingTask(null);
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "btn pending-btn";
      case "in-progress":
        return "btn in-progress-btn";
      case "completed":
        return "btn completed-btn";
      default:
        return "";
    }
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>My Tasks</h1>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <MdSearch />
          </div>
        </header>

        <section className="task-section">
          {isTaskFetching ? (
            <div className="task-loading-state">
              <Loader className="task-loading-spinner" />
            </div>
          ) : editingTask ? (
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
                    <option>pending</option>
                    <option>in-progress</option>
                    <option>completed</option>
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
                    <option>high</option>
                    <option>medium</option>
                    <option>low</option>
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
                <div className="input-group">
                  <label>Assigned By:</label>
                  <input type="text" value={formData.assignedBy} readOnly />
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
                  <th>Assigned By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter((task) =>
                  task.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-tasks-message">
                      No tasks found
                    </td>
                  </tr>
                ) : (
                  tasks
                    .filter((task) =>
                      task.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                          <button
                            className={getStatusClass(task.status)}
                            disabled
                          >
                            {task.status}
                          </button>
                        </td>
                        <td>{task.priority}</td>
                        <td>{task.deadline}</td>
                        <td>{task.assigned_by_name}</td>
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
                    ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </section>
  );
};

export default MyTasks;
