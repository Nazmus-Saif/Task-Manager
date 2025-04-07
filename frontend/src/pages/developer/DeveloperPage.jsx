import React from "react";
import { Link } from "react-router-dom";
import { MdAssignment, MdCheckCircle, MdPendingActions } from "react-icons/md";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import { authenticationController } from "../../controllers/authenticationController.js";

const DeveloperPage = () => {
  const { authorizedUser } = authenticationController();
  return (
    <section className="dashboard-container">
      <SideBarLayout role={authorizedUser?.user_data.role} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Welcome, Developer</h1>
          <Link to="/user/profile" className="profile">
            <img src="../images/avatar.png" alt="Profile" />
          </Link>
        </header>

        <section className="dashboard-metrics">
          <div className="metric-card">
            <MdAssignment />
            <div className="metric-details">
              <h3>My Tasks</h3>
              <h1>12</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdCheckCircle />
            <div className="metric-details">
              <h3>Completed</h3>
              <h1>8</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdPendingActions />
            <div className="metric-details">
              <h3>Pending</h3>
              <h1>3</h1>
            </div>
          </div>
        </section>
      </main>
    </section>
  );
};

export default DeveloperPage;
