import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { MdAssignment, MdCheckCircle, MdPendingActions } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";
import CreateTaskForm from "../../components/CreateTaskForm.jsx";
import { authController } from "../../controllers/authController.js";

const User = () => {
  const {
    authorizedUser,
    getCounts,
    getStatusCounts,
    getUpcomingDeadlines,
    getUserTasksCounts,
    userTasksCounts,
  } = authController();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(null);

  useEffect(() => {
    getCounts();
    getStatusCounts();
    getUpcomingDeadlines();
  }, []);

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      getUserTasksCounts(authorizedUser.data.id);
    }
  }, [authorizedUser, getUserTasksCounts]);

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/notifications/${authorizedUser.data.id}/`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNewMessage(data);

        setTimeout(() => {
          setNewMessage(null);
        }, 5000);
      };
      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      return () => ws.close();
    }
  }, [authorizedUser]);

  const canCreateUser = authorizedUser?.data?.permissions?.create_user;
  const canCreateTask = authorizedUser?.data?.permissions?.create_task;

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
              <CreateTaskForm closeForm={() => setIsTaskFormOpen(false)} />
            </div>
          </div>
        )}

        {newMessage && (
          <div className="new-message-notification">
            <p>{newMessage}</p>
          </div>
        )}
      </main>
    </section>
  );
};

export default User;
