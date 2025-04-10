import React, { useState, useEffect } from "react";
import { MdAdd, MdBusiness, MdWork, MdPeople } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";
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
    addTask,
    isTaskAdded,
    getUsers,
    users,
    getCounts,
    counts,
    getStatusCounts,
    statusCounts,
    upcomingDeadlines,
    getUpcomingDeadlines,
    isGettingUpcomingDeadlines,
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
              onClick={() => setIsFormOpen(true)}
            >
              <MdAdd /> Add User
            </button>
            <button
              className="btn create-task-btn"
              onClick={() => setIsTaskFormOpen(true)}
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
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
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
                  {isTaskAdded ? (
                    <FaSpinner className="loading-icon" />
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};

export default AdminDashboard;
