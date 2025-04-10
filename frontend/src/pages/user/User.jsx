import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { MdAssignment, MdCheckCircle, MdPendingActions } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authController } from "../../controllers/authController.js";
import SignUpForm from "../../components/SignUpForm.jsx";

const User = () => {
  const {
    authorizedUser,
    addTask,
    isTaskAdded,
    getUsers,
    users,
    getCounts,
    getStatusCounts,
    getUpcomingDeadlines,
    getUserTasksCounts,
    userTasksCounts,
  } = authController();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState(1);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    getUsers();
    getCounts();
    getStatusCounts();
    getUpcomingDeadlines();
  }, []);

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      getUserTasksCounts(authorizedUser.data.id);
    }
  }, [authorizedUser, getUserTasksCounts]);

  const canCreateUser = authorizedUser?.data?.permissions?.create_user;
  const canCreateTask = authorizedUser?.data?.permissions?.create_task;

  const handleTaskFormSubmit = async (e) => {
    e.preventDefault();

    const priorityMap = {
      1: "low",
      2: "medium",
      3: "high",
    };

    const statusMap = {
      1: "pending",
      2: "in-progress",
      3: "completed",
    };

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      assigned_to: assignedTo,
      priority: priorityMap[priority],
      status: statusMap[status],
      deadline,
    };

    await addTask(taskData);

    setTaskTitle("");
    setTaskDescription("");
    setAssignedTo("");
    setPriority(1);
    setStatus(1);
    setDeadline("");
    setIsTaskFormOpen(false);
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Welcome {authorizedUser?.data.name}</h1>
          <div className="nav-right">
            {canCreateUser && (
              <button
                className="btn add-user-btn"
                onClick={() => setIsFormOpen(true)}
              >
                <MdAdd /> Add User
              </button>
            )}

            {canCreateTask && (
              <button
                className="btn create-task-btn"
                onClick={() => setIsTaskFormOpen(true)}
              >
                <MdAdd /> Create Task
              </button>
            )}

            <Link to="/user/profile" className="profile">
              <img src="../images/avatar.png" alt="Profile" />
            </Link>
          </div>
        </header>

        <section className="dashboard-metrics">
          <div className="metric-card">
            <MdAssignment />
            <div className="metric-details">
              <h3>Total Tasks</h3>
              <h1>{userTasksCounts && userTasksCounts[0]?.total_tasks}</h1>
            </div>
          </div>
          <div className="metric-card">
            <MdPendingActions />
            <div className="metric-details">
              <h3>Pending</h3>
              <h1>{userTasksCounts && userTasksCounts[0]?.total_pending}</h1>
            </div>
          </div>
          <div className="metric-card">
            <MdCheckCircle />
            <div className="metric-details">
              <h3>In-Progress</h3>
              <h1>
                {userTasksCounts && userTasksCounts[0]?.total_in_progress}
              </h1>
            </div>
          </div>
          <div className="metric-card">
            <MdCheckCircle />
            <div className="metric-details">
              <h3>Completed</h3>
              <h1>{userTasksCounts && userTasksCounts[0]?.total_completed}</h1>
            </div>
          </div>
        </section>

        {canCreateUser && (
          <div className={`form-container ${isFormOpen ? "active" : ""}`}>
            <div
              className={`form-overlay ${isFormOpen ? "active" : ""}`}
              onClick={() => setIsFormOpen(false)}
            ></div>
            <div className="form-wrapper">
              <button
                className="btn close-button"
                onClick={() => setIsFormOpen(false)}
              >
                &times;
              </button>
              <SignUpForm closeForm={() => setIsFormOpen(false)} />
            </div>
          </div>
        )}

        {canCreateTask && (
          <div className={`form-container ${isTaskFormOpen ? "active" : ""}`}>
            <div
              className={`form-overlay ${isTaskFormOpen ? "active" : ""}`}
              onClick={() => setIsTaskFormOpen(false)}
            ></div>
            <div className="form-wrapper">
              <button
                className="btn close-button"
                onClick={() => setIsTaskFormOpen(false)}
              >
                &times;
              </button>
              <form onSubmit={handleTaskFormSubmit}>
                <div className="form-content">
                  <h2>Create Task</h2>
                  <div className="form-input-wrapper">
                    <input
                      type="text"
                      placeholder="Task Title"
                      className="form-input-field"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-input-wrapper">
                    <textarea
                      placeholder="Description"
                      className="form-input-field"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="form-input-wrapper">
                    <select
                      className="form-input-field"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      <option value="">Select Users</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.role}
                        </option>
                      ))}
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
                      className="form-input-field"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="form-button">
                    {isTaskAdded ? "Loading..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default User;
