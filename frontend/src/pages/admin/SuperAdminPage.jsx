import React, { useState } from "react";
import { MdAdd, MdSupervisorAccount, MdWork, MdPeople } from "react-icons/md";
import { Link } from "react-router-dom";
import SideBarLayout from "../../components/SideBarLayout.jsx";
import SignUpForm from "../../components/SignUpForm.jsx";

const AdminDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const userRole = "admin";

  return (
    <section className="dashboard-container">
      <SideBarLayout role={userRole} />

      <main className="main-content">
        <header className="top-nav">
          <h1>Welcome, Admin</h1>
          <div className="nav-right">
            <button
              className="btn add-user-btn"
              onClick={() => setIsFormOpen(true)}
            >
              <MdAdd /> Add User
            </button>
            <Link to="/user/profile" className="profile">
              <img src="../images/Nazmus Saif.jpg" alt="Profile" />
            </Link>
          </div>
        </header>

        <section className="dashboard-metrics">
          <div className="metric-card">
            <MdSupervisorAccount />
            <div className="metric-details">
              <h3>Project Managers</h3>
              <h1>25</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdPeople />
            <div className="metric-details">
              <h3>Developers</h3>
              <h1>14</h1>
            </div>
          </div>

          <div className="metric-card">
            <MdWork />
            <div className="metric-details">
              <h3>Tasks</h3>
              <h1>10,864</h1>
            </div>
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
      </main>
    </section>
  );
};

export default AdminDashboard;
