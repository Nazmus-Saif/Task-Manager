import React from "react";
import { Link } from "react-router-dom";
import { MdWork, MdPendingActions, MdPeopleAlt } from "react-icons/md";
import { Pie } from "react-chartjs-2";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { authenticationController } from "../../controllers/authenticationController.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const ProjectManagerDashboard = () => {
  const { authorizedUser } = authenticationController();
  const data = {
    labels: ["Complete", "Pending", "In Progress"],
    datasets: [
      {
        data: [5, 15, 3],
        backgroundColor: ["#2ECC71", "#E74C3C", "#F39C12"],
        hoverBackgroundColor: ["#27AE60", "#C0392B", "#F1C40F"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " tasks";
          },
        },
      },
    },
  };

  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.user_data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Welcome, Project Manager</h1>
          <Link to="/user/profile" className="profile">
            <img src="../images/Tanvir Zaman.jpg" alt="Profile Picture" />
          </Link>
        </header>

        <section className="dashboard-metrics">
          <div className="metric-card">
            <MdWork />
            <div className="metric-details">
              <h3>Tasks</h3>
              <h1>8</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdPendingActions />
            <div className="metric-details">
              <h3>Pending</h3>
              <h1>15</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdPeopleAlt />
            <div className="metric-details">
              <h3>Developers</h3>
              <h1>12</h1>
            </div>
          </div>
        </section>

        <section className="chart-section">
          <h2>Task Completion Status</h2>
          <div className="chart-container">
            <Pie data={data} options={options} />
          </div>
        </section>
      </main>
    </section>
  );
};

export default ProjectManagerDashboard;
