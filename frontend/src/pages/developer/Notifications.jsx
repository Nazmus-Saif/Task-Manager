import React, { useState, useEffect } from "react";
import SideBarLayout from "../../components/SideBarLayout.jsx";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        message:
          "You have been assigned a new task: Fix Login Bug in the Authentication System project. Please check your tasks for more details.",
        date: "March 20, 2025",
      },
      {
        id: 2,
        message:
          "You have been assigned to the API Integration task for the Payment Gateway project. Deadline: March 28, 2025.",
        date: "March 18, 2025",
      },
      {
        id: 3,
        message:
          "Your task 'Dashboard UI' in the Admin Panel project has been marked as completed.",
        date: "March 19, 2025",
      },
    ]);
  }, []);
  const userRole = "developer";

  return (
    <section className="dashboard-container">
      <SideBarLayout role={userRole} />
      <main className="main-content">
        <header className="top-nav">
          <h1>Notifications</h1>
        </header>

        <section className="notification-section">
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <small>{notification.date}</small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </section>
  );
};

export default Notifications;
