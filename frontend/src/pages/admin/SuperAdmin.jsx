import React, { useState, useEffect } from "react";
import { MdAdd, MdBusiness, MdWork, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";
import CreateTaskForm from "../../components/CreateTaskForm.jsx";
import RolePermissionsForm from "../../components/RolePermissions.jsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);
import DataVisualization from "../../components/DataVisualization.jsx";
import { authController } from "../../controllers/authController.js";

const AdminDashboard = () => {
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
  }, []);

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

  const data = {
    labels: ["Complete", "Pending", "In Progress"],
    datasets: [
      {
        label: "Tasks",
        data: [
          statusCounts?.completed,
          statusCounts?.pending,
          statusCounts?.inProgress,
        ],
        backgroundColor: ["#28A745", "#DC3545", "#F39C12"],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " tasks";
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => value,
        font: {
          weight: "bold",
          size: 14,
        },
        color: "#e0e0e0",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 50,
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          display: false,
        },
      },
    },
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.data.role} />

      <main className="main-content">
        <header className="top-nav">
          <h1>Welcome {authorizedUser?.data.name}</h1>
          <div className="nav-right">
            <button
              className="btn add-user-btn"
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
          <div className="metric-card">
            <MdBusiness />
            <div className="metric-details">
              <h3>Total Roles</h3>
              <h1>{counts && counts[0]?.total_roles - 1}</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdPeople />
            <div className="metric-details">
              <h3>Total Users</h3>
              <h1>{counts && counts[0]?.total_users - 1}</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdWork />
            <div className="metric-details">
              <h3>Total Tasks</h3>
              <h1>{counts && counts[0]?.total_tasks}</h1>
            </div>
          </div>
        </section>

        <section className="chart-section">
          <h2>Task Completion Status</h2>
          <div className="chart-container">
            <Bar data={data} options={options} />
          </div>
          <div className="chart-container">
            {!isGettingUpcomingDeadlines && upcomingDeadlines?.length > 0 && (
              <DataVisualization data={upcomingDeadlines} />
            )}
          </div>
        </section>

        <div
          className={`form-container ${isCreateRoleFormOpen ? "active" : ""}`}
        >
          <div
            className={`form-overlay ${isCreateRoleFormOpen ? "active" : ""}`}
            onClick={() => setIsCreateRoleFormOpen(false)}
          ></div>
          <div className="form-wrapper">
            <button
              className="btn close-button"
              onClick={() => setIsCreateRoleFormOpen(false)}
            >
              &times;
            </button>
            <RolePermissionsForm />
          </div>
        </div>

        <div
          className={`form-container ${isCreateUserFormOpen ? "active" : ""}`}
        >
          <div
            className={`form-overlay ${isCreateUserFormOpen ? "active" : ""}`}
            onClick={() => setIsCreateUserFormOpen(false)}
          ></div>
          <div className="form-wrapper">
            <button
              className="btn close-button"
              onClick={() => setIsCreateUserFormOpen(false)}
            >
              &times;
            </button>
            <SignUpForm closeForm={() => setIsCreateUserFormOpen(false)} />
          </div>
        </div>

        <div
          className={`form-container ${isCreateTaskFormOpen ? "active" : ""}`}
        >
          <div
            className={`form-overlay ${isCreateTaskFormOpen ? "active" : ""}`}
            onClick={() => setIsCreateTaskFormOpen(false)}
          ></div>
          <div className="form-wrapper">
            <button
              className="btn close-button"
              onClick={() => setIsCreateTaskFormOpen(false)}
            >
              &times;
            </button>
            <CreateTaskForm closeForm={() => setIsCreateTaskFormOpen(false)} />
          </div>
        </div>
      </main>
      {newMessage && (
        <div className="new-message-notification">
          <p>{newMessage}</p>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
