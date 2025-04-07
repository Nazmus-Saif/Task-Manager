import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdCreate } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authenticationController } from "../../controllers/authenticationController.js";

const Management = () => {
  const { authorizedUser } = authenticationController();
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false);
  const { addTask, isTaskAdded } = authenticationController();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState();
  const [status, setStatus] = useState();
  const [deadline, setDeadline] = useState("");

  const handleOpenAssignTaskForm = () => setIsAssignTaskOpen(true);
  const handleCloseAssignTaskForm = () => setIsAssignTaskOpen(false);

  const userPermissions = { canCreateTask: true };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      assigned_to: assignedTo,
      priority,
      status,
      deadline,
    };

    try {
      await addTask(taskData);

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority(2);
      setStatus(1);
      setDeadline("");
      setIsAssignTaskOpen(false);
    } catch (error) {
      console.error("Error while assigning task:", error);
    }
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.user_data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Operations</h1>
        </header>

        <section className="operation-section">
          {userPermissions.canCreateTask ? (
            <button className="btn" onClick={handleOpenAssignTaskForm}>
              <MdCreate /> Assign Task
            </button>
          ) : (
            <p>You don't have permission for any operations.</p>
          )}
        </section>
      </main>

      <div className={`form-container ${isAssignTaskOpen ? "active" : ""}`}>
        <div
          className={`form-overlay ${isAssignTaskOpen ? "active" : ""}`}
          onClick={handleCloseAssignTaskForm}
        ></div>
        <div className="form-wrapper">
          <button
            className="btn close-button"
            onClick={handleCloseAssignTaskForm}
          >
            &times;
          </button>
          <form onSubmit={handleSubmit}>
            <div className="form-content">
              <h2>Assign Task</h2>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  placeholder="Task Title"
                  className="form-input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-input-wrapper">
                <textarea
                  placeholder="Description"
                  className="form-input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="form-input-wrapper">
                <select
                  className="form-input-field"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Select Developer</option>
                  <option value="1">Developer 1</option>
                  <option value="2">Developer 2</option>
                </select>
              </div>

              <div className="form-input-wrapper">
                <select
                  className="form-input-field"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </select>
              </div>

              <div className="form-input-wrapper">
                <input
                  type="date"
                  placeholder="Deadline"
                  className="form-input-field"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="form-button"
                disabled={isTaskAdded}
              >
                {isTaskAdded ? (
                  <FaSpinner className="loading-icon" />
                ) : (
                  "Assign Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Management;
