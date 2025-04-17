import React, { useState, useEffect } from "react";
import { MdAdd, MdBusiness, MdWork, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import AdminSideBar from "../../components/AdminSideBar.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";
import CreateTaskForm from "../../components/CreateTaskForm.jsx";
import RolePermissionsForm from "../../components/RolePermissions.jsx";
import DeadlinesChart from "../../components/DeadlinesChart.jsx";
import TaskStatusChart from "../../components/TaskStatusChart.jsx";
import FloatingForm from "../../components/FloatingForm.jsx";
import { authController } from "../../controllers/authController.js";

const SuperAdmin = () => {
  const {
    authorizedUser,
    getCounts,
    counts,
    getStatusCounts,
    statusCounts,
    upcomingDeadlines,
    getUpcomingDeadlines,
    isGettingUpcomingDeadlines,
  } = authController();

  const [isCreateRoleFormOpen, setIsCreateRoleFormOpen] = useState(false);
  const [isCreateUserFormOpen, setIsCreateUserFormOpen] = useState(false);
  const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getCounts();
    getStatusCounts();
    getUpcomingDeadlines();
  }, [getCounts, getStatusCounts, getUpcomingDeadlines]);

  useEffect(() => {
    if (authorizedUser?.data?.id) {
      const ws = new WebSocket(
        `ws://localhost:8000/ws/status_update/${authorizedUser.data.id}/`
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

  return (
    <section className="dashboard-container">
      <AdminSideBar />

      {isGettingUpcomingDeadlines ? (
        <div className="task-loading-state">
          <Loader className="task-loading-spinner" />
        </div>
      ) : (
        <main className="main-content">
          <header className="top-nav">
            <h1>Hey, {authorizedUser?.data.name}</h1>
            <div className="nav-right">
              <button
                className="btn create-role-btn"
                onClick={() => setIsCreateRoleFormOpen(true)}
              >
                <MdAdd /> Create Role
              </button>
              <button
                className="btn add-user-btn"
                onClick={() => setIsCreateUserFormOpen(true)}
              >
                <MdAdd /> Add User
              </button>
              <button
                className="btn create-task-btn"
                onClick={() => setIsCreateTaskFormOpen(true)}
              >
                <MdAdd /> Create Task
              </button>
              <Link to="/user/profile" className="profile">
                <img src="../images/Nazmus Saif.jpg" alt="Profile" />
              </Link>
            </div>
          </header>

          <section className="dashboard-metrics">
            <div className="metric-card metric-card-1">
              <MdBusiness />
              <div className="metric-details">
                <h3>Total Roles</h3>
                <h1>{counts && counts[0]?.total_roles - 1}</h1>
              </div>
            </div>

            <div className="metric-card metric-card-2">
              <MdPeople />
              <div className="metric-details">
                <h3>Total Users</h3>
                <h1>{counts && counts[0]?.total_users - 1}</h1>
              </div>
            </div>

            <div className="metric-card metric-card-3">
              <MdWork />
              <div className="metric-details">
                <h3>Total Tasks</h3>
                <h1>{counts && counts[0]?.total_tasks}</h1>
              </div>
            </div>
          </section>

          <section className="chart-section">
            <div className="chart-container">
              <h3>Task Completion Status</h3>
              <TaskStatusChart statusCounts={statusCounts} />
            </div>

            <div className="chart-container">
              <h3>Upcoming Task Deadlines</h3>
              {!isGettingUpcomingDeadlines && upcomingDeadlines?.length > 0 && (
                <DeadlinesChart data={upcomingDeadlines} />
              )}
            </div>
          </section>

          {/* Floating Forms */}
          <FloatingForm
            isOpen={isCreateRoleFormOpen}
            onClose={() => setIsCreateRoleFormOpen(false)}
          >
            <RolePermissionsForm />
          </FloatingForm>

          <FloatingForm
            isOpen={isCreateUserFormOpen}
            onClose={() => setIsCreateUserFormOpen(false)}
          >
            <SignUpForm closeForm={() => setIsCreateUserFormOpen(false)} />
          </FloatingForm>

          <FloatingForm
            isOpen={isCreateTaskFormOpen}
            onClose={() => setIsCreateTaskFormOpen(false)}
          >
            <CreateTaskForm closeForm={() => setIsCreateTaskFormOpen(false)} />
          </FloatingForm>
        </main>
      )}

      {newMessage && (
        <div className="new-message-notification">
          <p>{newMessage}</p>
        </div>
      )}
    </section>
  );
};

export default SuperAdmin;
